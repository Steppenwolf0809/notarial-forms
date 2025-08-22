import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { z } from 'zod'
import {
  UAFEPersonaNaturalFormSchema,
  FormSessionSchema,
  FormSessionStatusSchema
} from '@notarial-forms/shared-types'

const prisma = new PrismaClient()

// Fallback en memoria cuando la base de datos no está disponible (modo demo)
type MemorySession = {
  id: string
  accessId: string
  documentId: string
  ownerName?: string
  ownerCedula?: string
  status?: string
  data?: any
  createdAt: string
  updatedAt: string
}

const memoryStore: Map<string, MemorySession> = new Map()

const useMemoryFallback = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1` as any
    return false
  } catch {
    return true
  }
}

// Utilidad: generar accessId corto para URL
const generateAccessId = (): string => crypto.randomBytes(6).toString('base64url')

// Body schemas
const CreateFormSessionBody = z.object({
  ownerName: z.string().optional(),
  ownerCedula: z.string().min(6).max(20), // se usará como contraseña
  expiresAt: z.string().datetime().optional(),
  data: UAFEPersonaNaturalFormSchema.optional()
})

const UpdateFormSessionBody = z.object({
  ownerCedula: z.string().min(6).max(20).optional(),
  data: UAFEPersonaNaturalFormSchema.optional(),
  status: FormSessionStatusSchema.optional()
})

export const createFormSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const body = CreateFormSessionBody.parse(req.body)
    const accessId = generateAccessId()

    if (await useMemoryFallback()) {
      const now = new Date().toISOString()
      const mem: MemorySession = {
        id: `mem_${accessId}`,
        accessId,
        documentId: id,
        ownerName: body.ownerName,
        ownerCedula: body.ownerCedula,
        data: body.data,
        status: 'DRAFT',
        createdAt: now,
        updatedAt: now
      }
      memoryStore.set(accessId, mem)
      res.json({ success: true, data: { accessId: mem.accessId, id: mem.id } })
      return
    }

    const session = await prisma.formSession.create({
      data: {
        documentId: id,
        accessId,
        ownerName: body.ownerName,
        ownerCedula: body.ownerCedula,
        data: body.data as any,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null
      }
    })

    res.json({ success: true, data: { accessId: session.accessId, id: session.id } })
  } catch (err: any) {
    res.status(400).json({ success: false, error: 'VALIDATION_ERROR', details: err.message })
  }
}

// Autenticación simple por cédula via query/header/body
const resolveCedula = (req: Request): string | undefined => {
  return (req.headers['x-cedula'] as string) || (req.query.cedula as string) || (req.body?.cedula as string)
}

export const getFormSessionByAccessId = async (req: Request, res: Response) => {
  try {
    const { accessId } = req.params
    if (await useMemoryFallback()) {
      const mem = memoryStore.get(accessId)
      if (!mem) return res.status(404).json({ success: false, error: 'SESSION_NOT_FOUND' })
      const { ownerCedula, ...safe } = mem as any
      res.json({ success: true, data: safe })
      return
    }

    const session = await prisma.formSession.findUnique({ where: { accessId } })
    if (!session) return res.status(404).json({ success: false, error: 'SESSION_NOT_FOUND' })

    // No devolvemos ownerCedula
    const { ownerCedula, ...safe } = session as any
    res.json({ success: true, data: safe })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', details: err.message })
  }
}

export const updateFormSessionByAccessId = async (req: Request, res: Response) => {
  try {
    const { accessId } = req.params
    const cedula = resolveCedula(req)
    if (!cedula) return res.status(401).json({ success: false, error: 'UNAUTHORIZED' })

    const body = UpdateFormSessionBody.parse(req.body)
    if (await useMemoryFallback()) {
      const mem = memoryStore.get(accessId)
      if (!mem) return res.status(404).json({ success: false, error: 'SESSION_NOT_FOUND' })
      if (mem.ownerCedula !== cedula) return res.status(403).json({ success: false, error: 'FORBIDDEN' })
      mem.data = body.data ?? mem.data
      mem.status = body.status ?? mem.status
      mem.updatedAt = new Date().toISOString()
      memoryStore.set(accessId, mem)
      res.json({ success: true, data: { id: mem.id, status: mem.status } })
      return
    }

    const session = await prisma.formSession.findUnique({ where: { accessId } })
    if (!session) return res.status(404).json({ success: false, error: 'SESSION_NOT_FOUND' })
    if (session.ownerCedula !== cedula) return res.status(403).json({ success: false, error: 'FORBIDDEN' })

    const updated = await prisma.formSession.update({
      where: { accessId },
      data: {
        data: body.data as any,
        status: body.status || undefined
      }
    })

    res.json({ success: true, data: { id: updated.id, status: updated.status } })
  } catch (err: any) {
    res.status(400).json({ success: false, error: 'VALIDATION_ERROR', details: err.message })
  }
}

export const completeFormSession = async (req: Request, res: Response) => {
  try {
    const { accessId } = req.params
    const cedula = resolveCedula(req)
    if (!cedula) return res.status(401).json({ success: false, error: 'UNAUTHORIZED' })
    if (await useMemoryFallback()) {
      const mem = memoryStore.get(accessId)
      if (!mem) return res.status(404).json({ success: false, error: 'SESSION_NOT_FOUND' })
      if (mem.ownerCedula !== cedula) return res.status(403).json({ success: false, error: 'FORBIDDEN' })
      mem.status = 'COMPLETED'
      mem.updatedAt = new Date().toISOString()
      memoryStore.set(accessId, mem)
      res.json({ success: true })
      return
    }

    const session = await prisma.formSession.findUnique({ where: { accessId } })
    if (!session) return res.status(404).json({ success: false, error: 'SESSION_NOT_FOUND' })
    if (session.ownerCedula !== cedula) return res.status(403).json({ success: false, error: 'FORBIDDEN' })

    await prisma.formSession.update({ where: { accessId }, data: { status: 'COMPLETED' } })
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', details: err.message })
  }
}

// Generación simple de PDF (stub): por ahora devuelve JSON; se puede integrar pdf-lib/puppeteer más adelante
export const generateFormPdf = async (req: Request, res: Response) => {
  try {
    const { accessId } = req.params
    const data = (await useMemoryFallback())
      ? memoryStore.get(accessId)?.data
      : (await prisma.formSession.findUnique({ where: { accessId } }))?.data
    if (!data) return res.status(404).json({ success: false, error: 'SESSION_NOT_FOUND' })

    // Validar datos contra esquema
    const parsed = UAFEPersonaNaturalFormSchema.safeParse(data)
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten() })
    }

    // Por ahora: enviar como attachment JSON; impresión PDF real se puede conectar a un servicio
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="uafe_${accessId}.json"`)
    res.send(JSON.stringify(parsed.data, null, 2))
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', details: err.message })
  }
}

// Crear sesión sin documentId (para flujos simulados)
export const createStandaloneFormSession = async (req: Request, res: Response) => {
  try {
    const body = CreateFormSessionBody.parse(req.body)
    const accessId = generateAccessId()
    // Crear un documento mínimo para cumplir FK en bases existentes
    const doc = await prisma.document.create({
      data: {
        fileName: `standalone_${accessId}.json`,
        originalName: 'standalone',
        filePath: `/tmp/standalone_${accessId}.json`,
        notariaId: 'NOTARIA_18_QUITO'
      }
    })
    const session = await prisma.formSession.create({
      data: {
        documentId: doc.id,
        accessId,
        ownerName: body.ownerName,
        ownerCedula: body.ownerCedula,
        data: body.data as any
      }
    })
    res.json({ success: true, data: { accessId: session.accessId, id: session.id } })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', details: err.message })
  }
}

export const listFormSessions = async (_req: Request, res: Response) => {
  try {
    if (await useMemoryFallback()) {
      const arr = Array.from(memoryStore.values())
      arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      res.json({ success: true, data: arr.map(({ ownerCedula, ...safe }) => safe) })
      return
    }
    const sessions = await prisma.formSession.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
    res.json({ success: true, data: sessions.map(({ ownerCedula, ...safe }) => safe) })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', details: err.message })
  }
}


