import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { z } from 'zod'
import dayjs from 'dayjs'

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors())
app.use(express.json())

const healthSchema = z.object({
  timestamp: z.string(),
  status: z.literal('healthy'),
  uptime: z.number()
})

app.get('/api/health', (req, res) => {
  const health = healthSchema.parse({
    timestamp: dayjs().toISOString(),
    status: 'healthy' as const,
    uptime: process.uptime()
  })
  
  res.json(health)
})

app.get('/api/hello', (req, res) => {
  res.json({ 
    message: 'Hello from Notarial Forms API!',
    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })
})

// Form session storage (in-memory for demo)
const formSessions = new Map<string, any>()

// Tramites queue - trámites listos para que los clientes completen
const tramitesQueue = new Map<string, any>()

// Generate short access ID
const generateAccessId = () => {
  return Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8)
}

// Form session schema
const CreateFormSessionSchema = z.object({
  ownerName: z.string().optional(),
  ownerCedula: z.string().min(6).max(20),
  data: z.any().optional()
})

const UpdateFormSessionSchema = z.object({
  data: z.any().optional(),
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'COMPLETED']).optional()
})

// Create form session endpoint
app.post('/api/documents/form-session', (req, res) => {
  try {
    console.log('📋 POST /api/documents/form-session - Body:', req.body)
    
    const body = CreateFormSessionSchema.parse(req.body)
    const accessId = generateAccessId()
    const now = new Date().toISOString()
    
    const session = {
      id: `session_${accessId}`,
      accessId,
      ownerName: body.ownerName,
      ownerCedula: body.ownerCedula,
      data: body.data || {},
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now
    }
    
    formSessions.set(accessId, session)
    console.log('✅ Sesión creada:', { accessId, id: session.id })
    
    res.json({ 
      success: true, 
      data: { 
        accessId: session.accessId, 
        id: session.id 
      } 
    })
  } catch (error: any) {
    console.error('❌ Error creando sesión:', error)
    res.status(400).json({ 
      success: false, 
      error: 'VALIDATION_ERROR', 
      details: error.message 
    })
  }
})

// Get form session by access ID
app.get('/api/documents/form-session/:accessId', (req, res) => {
  try {
    const { accessId } = req.params
    console.log('📖 GET /api/documents/form-session/' + accessId)
    
    const session = formSessions.get(accessId)
    if (!session) {
      console.log('❌ Sesión no encontrada:', accessId)
      return res.status(404).json({ 
        success: false, 
        error: 'SESSION_NOT_FOUND' 
      })
    }
    
    // Don't return sensitive data
    const { ownerCedula, ...safeSession } = session
    console.log('✅ Sesión encontrada:', safeSession.id)
    
    res.json({ 
      success: true, 
      data: safeSession 
    })
  } catch (error: any) {
    console.error('❌ Error obteniendo sesión:', error)
    res.status(500).json({ 
      success: false, 
      error: 'SERVER_ERROR', 
      details: error.message 
    })
  }
})

// Update form session
app.put('/api/documents/form-session/:accessId', (req, res) => {
  try {
    const { accessId } = req.params
    const cedula = req.headers['x-cedula'] as string
    console.log('📝 PUT /api/documents/form-session/' + accessId, { cedula })
    
    if (!cedula) {
      return res.status(401).json({ 
        success: false, 
        error: 'UNAUTHORIZED' 
      })
    }
    
    const session = formSessions.get(accessId)
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: 'SESSION_NOT_FOUND' 
      })
    }
    
    if (session.ownerCedula !== cedula) {
      console.log('❌ Cédula no coincide:', { expected: session.ownerCedula, provided: cedula })
      return res.status(403).json({ 
        success: false, 
        error: 'FORBIDDEN' 
      })
    }
    
    const body = UpdateFormSessionSchema.parse(req.body)
    
    // Update session
    session.data = body.data || session.data
    session.status = body.status || session.status
    session.updatedAt = new Date().toISOString()
    
    formSessions.set(accessId, session)
    console.log('✅ Sesión actualizada:', session.id)
    
    res.json({ 
      success: true, 
      data: { 
        id: session.id, 
        status: session.status 
      } 
    })
  } catch (error: any) {
    console.error('❌ Error actualizando sesión:', error)
    res.status(400).json({ 
      success: false, 
      error: 'VALIDATION_ERROR', 
      details: error.message 
    })
  }
})

// Generate PDF (returns JSON for now)
app.get('/api/documents/form-session/:accessId/pdf', (req, res) => {
  try {
    const { accessId } = req.params
    console.log('📄 GET /api/documents/form-session/' + accessId + '/pdf')
    
    const session = formSessions.get(accessId)
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: 'SESSION_NOT_FOUND' 
      })
    }
    
    // Return JSON file for now (could be integrated with PDF generation later)
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="formulario_uafe_${accessId}.json"`)
    res.send(JSON.stringify(session.data, null, 2))
  } catch (error: any) {
    console.error('❌ Error generando PDF:', error)
    res.status(500).json({ 
      success: false, 
      error: 'SERVER_ERROR', 
      details: error.message 
    })
  }
})

// List form sessions (for admin)
app.get('/api/documents/form-session', (req, res) => {
  try {
    console.log('📋 GET /api/documents/form-session - Listando sesiones')
    
    const sessions = Array.from(formSessions.values())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(({ ownerCedula, ...safe }) => safe) // Remove sensitive data
    
    console.log(`✅ Retornando ${sessions.length} sesiones`)
    
    res.json({ 
      success: true, 
      data: sessions 
    })
  } catch (error: any) {
    console.error('❌ Error listando sesiones:', error)
    res.status(500).json({ 
      success: false, 
      error: 'SERVER_ERROR', 
      details: error.message 
    })
  }
})

// Add tramite to queue (called when "Marcar como Listo" is clicked)
app.post('/api/tramites/add-to-queue', (req, res) => {
  try {
    console.log('📋 POST /api/tramites/add-to-queue - Body:', req.body)
    
    const { vendedor, comprador, tramiteData } = req.body
    const tramiteId = generateAccessId()
    
    // Create entries for each person in the transaction
    const personas = []
    
    if (vendedor && vendedor.nombres) {
      personas.push({
        id: generateAccessId(),
        tipo: 'VENDEDOR',
        nombres: vendedor.nombres,
        apellidos: vendedor.apellidos,
        cedula: vendedor.cedula || vendedor.numeroDocumento,
        nacionalidad: vendedor.nacionalidad || 'ECUATORIANA',
        tramiteId,
        status: 'PENDIENTE'
      })
    }
    
    if (comprador && comprador.nombres) {
      personas.push({
        id: generateAccessId(),
        tipo: 'COMPRADOR', 
        nombres: comprador.nombres,
        apellidos: comprador.apellidos,
        cedula: comprador.cedula || comprador.numeroDocumento,
        nacionalidad: comprador.nacionalidad || 'ECUATORIANA',
        tramiteId,
        status: 'PENDIENTE'
      })
    }
    
    // Store the tramite data
    const tramite = {
      id: tramiteId,
      actoContrato: tramiteData?.extractedData?.actoContrato || 'Acto notarial',
      valorContrato: tramiteData?.extractedData?.valorContrato || '0',
      fechaOtorgamiento: tramiteData?.extractedData?.fechaOtorgamiento || '',
      ubicacion: tramiteData?.extractedData?.ubicacion || {},
      personas,
      createdAt: new Date().toISOString(),
      status: 'LISTO_PARA_COMPLETAR'
    }
    
    tramitesQueue.set(tramiteId, tramite)
    
    // Also store individual sessions for each person
    personas.forEach(persona => {
      const sessionData = {
        personas: [{
          apellidos: persona.apellidos,
          nombres: persona.nombres,
          identificacion: { 
            tipo: 'CEDULA', 
            numero: persona.cedula,
            nacionalidad: persona.nacionalidad || 'ECUATORIANA'
          }
        }],
        ubicacionInmueble: tramiteData?.extractedData?.ubicacion || {},
        informacionTramite: {
          valorContrato: tramite.valorContrato,
          fecha: tramite.fechaOtorgamiento,
          actoContrato: tramite.actoContrato
        }
      }
      
      const accessId = generateAccessId()
      const session = {
        id: `session_${accessId}`,
        accessId,
        ownerName: `${persona.nombres} ${persona.apellidos}`.trim(),
        ownerCedula: persona.cedula,
        data: sessionData,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tramiteId: tramiteId,
        personaId: persona.id
      }
      
      formSessions.set(accessId, session)
      ;(persona as any).accessId = accessId // Link persona to their session
    })
    
    console.log(`✅ Trámite agregado a la cola: ${tramiteId} con ${personas.length} personas`)
    
    res.json({
      success: true,
      data: {
        tramiteId,
        personas,
        queueUrl: `${req.protocol}://${req.get('host')}/tramites`
      }
    })
  } catch (error: any) {
    console.error('❌ Error agregando trámite a la cola:', error)
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      details: error.message
    })
  }
})

// Get pending tramites for clients (public endpoint)
app.get('/api/tramites/pending', (req, res) => {
  try {
    console.log('📋 GET /api/tramites/pending - Obteniendo trámites pendientes')
    
    const pendingTramites = Array.from(tramitesQueue.values())
      .filter(tramite => tramite.status === 'LISTO_PARA_COMPLETAR')
      .map(tramite => ({
        id: tramite.id,
        actoContrato: tramite.actoContrato,
        valorContrato: tramite.valorContrato,
        fechaOtorgamiento: tramite.fechaOtorgamiento,
        personas: tramite.personas.map((p: any) => ({
          id: p.id,
          tipo: p.tipo,
          nombres: p.nombres,
          apellidos: p.apellidos,
          status: p.status,
          // No incluir cédula por seguridad
        })),
        createdAt: tramite.createdAt
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    
    console.log(`✅ Retornando ${pendingTramites.length} trámites pendientes`)
    
    res.json({
      success: true,
      data: pendingTramites
    })
  } catch (error: any) {
    console.error('❌ Error obteniendo trámites pendientes:', error)
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      details: error.message
    })
  }
})

// Validate client and get their form session
app.post('/api/tramites/validate-client', (req, res) => {
  try {
    const { personaId, cedula } = req.body
    console.log('🔐 POST /api/tramites/validate-client', { personaId })
    
    if (!personaId || !cedula) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_PARAMETERS'
      })
    }
    
    // Find the tramite and persona
    let foundPersona = null
    let foundTramite = null
    
    for (const tramite of tramitesQueue.values()) {
      const persona = tramite.personas.find((p: any) => p.id === personaId)
      if (persona) {
        foundPersona = persona
        foundTramite = tramite
        break
      }
    }
    
    if (!foundPersona) {
      console.log('❌ Persona no encontrada:', personaId)
      return res.status(404).json({
        success: false,
        error: 'PERSONA_NOT_FOUND'
      })
    }
    
    // Validate cedula
    if (foundPersona.cedula !== cedula) {
      console.log('❌ Cédula no coincide:', { expected: foundPersona.cedula, provided: cedula })
      return res.status(403).json({
        success: false,
        error: 'INVALID_CEDULA'
      })
    }
    
    console.log('✅ Cliente validado:', foundPersona.nombres)
    
    res.json({
      success: true,
      data: {
        accessId: foundPersona.accessId,
        persona: {
          nombres: foundPersona.nombres,
          apellidos: foundPersona.apellidos,
          tipo: foundPersona.tipo
        },
        tramite: {
          actoContrato: foundTramite.actoContrato,
          valorContrato: foundTramite.valorContrato
        }
      }
    })
  } catch (error: any) {
    console.error('❌ Error validando cliente:', error)
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      details: error.message
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})