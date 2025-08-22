import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { detectarTipoActo, obtenerConfiguracionFormulario, validarDeteccion, obtenerCamposResumen, type TipoActoArticulo29 } from '../utils/detectarTipoActo'

interface TramiteData {
  id: string
  numeroTramite: string
  extractedData: any
  tipoActoDetectado?: TipoActoArticulo29
  confianzaDeteccion?: number
  datosComplementarios: {
    vendedor: {
      telefono: string
      celular: string
      correoElectronico: string
      direccionDomiciliaria: string
      profesionOcupacion: string
      avaluoMunicipal: string
      situacionLaboral: string
      nombreEntidad: string
      fechaIngreso: string
      direccionTrabajo: string
      ingresoMensual: string
      nivelEstudio: string
      genero: string
      estadoCivil: string
    }
    comprador: {
      telefono: string
      celular: string
      correoElectronico: string
      direccionDomiciliaria: string
      profesionOcupacion: string
      avaluoMunicipal: string
      situacionLaboral: string
      nombreEntidad: string
      fechaIngreso: string
      direccionTrabajo: string
      ingresoMensual: string
      nivelEstudio: string
      genero: string
      estadoCivil: string
    }
  }
  status: 'editando' | 'listo-envio' | 'enviado' | 'en-proceso' | 'completado'
  fechaCreacion: Date
  qrUrl: string
}

interface TramiteManagerProps {
  extractedData: any
  onGenerateQR: (tramiteData: TramiteData) => void
}

const TramiteManager: React.FC<TramiteManagerProps> = ({
  extractedData,
  onGenerateQR
}) => {
  const [tramiteData, setTramiteData] = useState<TramiteData | null>(null)
  const [activeSection, setActiveSection] = useState<'vendedor' | 'comprador'>('vendedor')

  // Inicializar datos del trámite cuando se reciben datos extraídos
  useEffect(() => {
    if (extractedData && !tramiteData) {
      const numeroTramite = `TR-${Date.now().toString().slice(-6)}`
      const qrUrl = ''
      
      // Detección automática del tipo de acto
      const tipoActoDetectado = detectarTipoActo(extractedData.actoContrato || '')
      const validacion = validarDeteccion(tipoActoDetectado, extractedData)
      
      const newTramite: TramiteData = {
        id: generateId(),
        numeroTramite,
        extractedData,
        tipoActoDetectado,
        confianzaDeteccion: validacion.confianza,
        datosComplementarios: {
          vendedor: {
            telefono: '',
            celular: '',
            correoElectronico: '',
            direccionDomiciliaria: '',
            profesionOcupacion: '',
            avaluoMunicipal: '',
            situacionLaboral: '',
            nombreEntidad: '',
            fechaIngreso: '',
            direccionTrabajo: '',
            ingresoMensual: '',
            nivelEstudio: '',
            genero: '',
            estadoCivil: ''
          },
          comprador: {
            telefono: '',
            celular: '',
            correoElectronico: '',
            direccionDomiciliaria: '',
            profesionOcupacion: '',
            avaluoMunicipal: '',
            situacionLaboral: '',
            nombreEntidad: '',
            fechaIngreso: '',
            direccionTrabajo: '',
            ingresoMensual: '',
            nivelEstudio: '',
            genero: '',
            estadoCivil: ''
          }
        },
        status: 'editando',
        fechaCreacion: new Date(),
        qrUrl
      }
      
      setTramiteData(newTramite)
    }
  }, [extractedData])

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const updateDatosComplementarios = (persona: 'vendedor' | 'comprador', field: string, value: string) => {
    if (!tramiteData) return

    setTramiteData(prev => ({
      ...prev!,
      datosComplementarios: {
        ...prev!.datosComplementarios,
        [persona]: {
          ...prev!.datosComplementarios[persona],
          [field]: value
        }
      }
    }))
  }

  const handleGenerateQR = async () => {
    if (!tramiteData) return

    console.log('🚀 Agregando trámite a la cola...', { tramiteData })

    try {
      const vendedor = tramiteData.extractedData?.vendedor || tramiteData.extractedData?.vendedores?.[0] || {}
      const comprador = tramiteData.extractedData?.comprador || tramiteData.extractedData?.compradores?.[0] || {}

      console.log('👥 Datos de las partes:', { vendedor, comprador })

      const payload = {
        vendedor,
        comprador,
        tramiteData
      }

      const res = await fetch('/api/tramites/add-to-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      console.log('📡 Respuesta del servidor:', res.status, res.statusText)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('❌ Error del servidor:', errorText)
        throw new Error(`Error ${res.status}: ${errorText}`)
      }

      const json = await res.json()
      console.log('✅ Trámite agregado a la cola:', json)

      if (json?.success) {
        const queueUrl = json.data.queueUrl || `${window.location.origin}/tramites`
        
        const updatedTramite = {
          ...tramiteData,
          status: 'listo-envio' as const,
          qrUrl: queueUrl
        }
        setTramiteData(updatedTramite)
        onGenerateQR(updatedTramite)
        
        alert(`✅ Trámite agregado exitosamente a la cola!\n\n📱 QR/Link único para todos los clientes:\n${queueUrl}\n\nLos clientes podrán:\n1. Escanear el QR o entrar al link\n2. Ver la lista de trámites pendientes\n3. Seleccionar su nombre\n4. Validarse con su cédula\n5. Completar su formulario UAFE`)
      } else {
        alert('❌ No se pudo agregar el trámite a la cola. Verifique la consola para más detalles.')
      }
    } catch (error) {
      console.error('❌ Error general:', error)
      alert('❌ Error inesperado al agregar trámite. Revise la consola para más detalles.')
    }
  }

  // Envío a cola eliminado en la versión simplificada

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copiado al portapapeles')
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Copiado al portapapeles')
    }
  }

  if (!tramiteData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Inicializando gestor de trámite...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'editando': return 'bg-yellow-100 text-yellow-800'
      case 'listo-envio': return 'bg-blue-100 text-blue-800'
      case 'enviado': return 'bg-green-100 text-green-800'
      case 'en-proceso': return 'bg-orange-100 text-orange-800'
      case 'completado': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header del Trámite */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Trámite #{tramiteData.numeroTramite}
            </h2>
            <p className="text-sm text-gray-600">
              {tramiteData.extractedData.actoContrato} - Valor: ${tramiteData.extractedData.valorContrato}
            </p>
            <p className="text-xs text-gray-500">
              Creado: {tramiteData.fechaCreacion.toLocaleString()}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tramiteData.status)}`}>
            {tramiteData.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        {/* Detección automática del tipo de acto */}
        {tramiteData.tipoActoDetectado && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{obtenerConfiguracionFormulario(tramiteData.tipoActoDetectado).icono}</span>
                <div>
                  <h4 className="font-medium text-blue-800">Tipo de Acto Detectado (Art. 29)</h4>
                  <p className="text-sm text-blue-600">
                    {obtenerConfiguracionFormulario(tramiteData.tipoActoDetectado).tituloFormulario.replace('Formulario UAFE - ', '')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  (tramiteData.confianzaDeteccion || 0) > 0.8 
                    ? 'bg-green-100 text-green-800' 
                    : (tramiteData.confianzaDeteccion || 0) > 0.6 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}>
                  Confianza: {Math.round((tramiteData.confianzaDeteccion || 0) * 100)}%
                </div>
              </div>
            </div>
            
            {/* Campos específicos detectados */}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              {obtenerCamposResumen(tramiteData.tipoActoDetectado, tramiteData.extractedData).map((campo, index) => (
                <div key={index} className="text-sm">
                  <span className="text-blue-600 font-medium">{campo.etiqueta}:</span>
                  <span className="ml-1 text-blue-800">{campo.valor}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información básica del acto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-700">Escritura</h4>
            <p className="text-sm text-gray-600">{tramiteData.extractedData.escritura}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Fecha</h4>
            <p className="text-sm text-gray-600">{tramiteData.extractedData.fechaOtorgamiento}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Provincia</h4>
            <p className="text-sm text-gray-600">{tramiteData.extractedData.ubicacion?.provincia}</p>
          </div>
        </div>
      </div>

      {/* Editor de Datos Complementarios */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveSection('vendedor')}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeSection === 'vendedor'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>👤</span>
                <div>
                  <div>Vendedor</div>
                  <div className="text-xs">
                    {tramiteData.extractedData.vendedor?.nombres} {tramiteData.extractedData.vendedor?.apellidos}
                  </div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setActiveSection('comprador')}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeSection === 'comprador'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>🏠</span>
                <div>
                  <div>Comprador</div>
                  <div className="text-xs">
                    {tramiteData.extractedData.comprador?.nombres} {tramiteData.extractedData.comprador?.apellidos}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Completar información para {activeSection}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Datos de contacto */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Datos de Contacto</h4>
                  <input
                    type="tel"
                    placeholder="Teléfono convencional"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tramiteData.datosComplementarios[activeSection].telefono}
                    onChange={(e) => updateDatosComplementarios(activeSection, 'telefono', e.target.value)}
                  />
                  <input
                    type="tel"
                    placeholder="Celular"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tramiteData.datosComplementarios[activeSection].celular}
                    onChange={(e) => updateDatosComplementarios(activeSection, 'celular', e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tramiteData.datosComplementarios[activeSection].correoElectronico}
                    onChange={(e) => updateDatosComplementarios(activeSection, 'correoElectronico', e.target.value)}
                  />
                  <textarea
                    placeholder="Dirección domiciliaria"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tramiteData.datosComplementarios[activeSection].direccionDomiciliaria}
                    onChange={(e) => updateDatosComplementarios(activeSection, 'direccionDomiciliaria', e.target.value)}
                  />
                </div>

                {/* Datos personales */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Datos Personales</h4>
                                      <input
                      type="text"
                      placeholder="Profesión u ocupación"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={tramiteData.datosComplementarios[activeSection].profesionOcupacion}
                      onChange={(e) => updateDatosComplementarios(activeSection, 'profesionOcupacion', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Avalúo Municipal (requerido por UAFE)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={tramiteData.datosComplementarios[activeSection].avaluoMunicipal || ''}
                      onChange={(e) => updateDatosComplementarios(activeSection, 'avaluoMunicipal', e.target.value)}
                    />
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tramiteData.datosComplementarios[activeSection].genero}
                    onChange={(e) => updateDatosComplementarios(activeSection, 'genero', e.target.value)}
                  >
                    <option value="">Seleccionar género</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tramiteData.datosComplementarios[activeSection].estadoCivil}
                    onChange={(e) => updateDatosComplementarios(activeSection, 'estadoCivil', e.target.value)}
                  >
                    <option value="">Seleccionar estado civil</option>
                    <option value="soltero">Soltero/a</option>
                    <option value="casado">Casado/a</option>
                    <option value="divorciado">Divorciado/a</option>
                    <option value="viudo">Viudo/a</option>
                    <option value="union-libre">Unión libre</option>
                  </select>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tramiteData.datosComplementarios[activeSection].nivelEstudio}
                    onChange={(e) => updateDatosComplementarios(activeSection, 'nivelEstudio', e.target.value)}
                  >
                    <option value="">Seleccionar nivel de estudio</option>
                    <option value="primaria">Primaria</option>
                    <option value="secundaria">Secundaria</option>
                    <option value="superior">Superior</option>
                    <option value="postgrado">Postgrado</option>
                  </select>
                </div>

                {/* Datos laborales */}
                <div className="space-y-3 md:col-span-2">
                  <h4 className="font-medium text-gray-700">Información Laboral</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={tramiteData.datosComplementarios[activeSection].situacionLaboral}
                      onChange={(e) => updateDatosComplementarios(activeSection, 'situacionLaboral', e.target.value)}
                    >
                      <option value="">Situación laboral</option>
                      <option value="empleado-publico">Empleado público</option>
                      <option value="empleado-privado">Empleado privado</option>
                      <option value="independiente">Independiente</option>
                      <option value="jubilado">Jubilado</option>
                      <option value="estudiante">Estudiante</option>
                      <option value="desempleado">Desempleado</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Nombre de la entidad"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={tramiteData.datosComplementarios[activeSection].nombreEntidad}
                      onChange={(e) => updateDatosComplementarios(activeSection, 'nombreEntidad', e.target.value)}
                    />
                    <input
                      type="date"
                      placeholder="Fecha de ingreso"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={tramiteData.datosComplementarios[activeSection].fechaIngreso}
                      onChange={(e) => updateDatosComplementarios(activeSection, 'fechaIngreso', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <textarea
                      placeholder="Dirección del trabajo"
                      rows={2}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={tramiteData.datosComplementarios[activeSection].direccionTrabajo}
                      onChange={(e) => updateDatosComplementarios(activeSection, 'direccionTrabajo', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Ingreso mensual USD"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={tramiteData.datosComplementarios[activeSection].ingresoMensual}
                      onChange={(e) => updateDatosComplementarios(activeSection, 'ingresoMensual', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Sección de QR y Envío */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Generar QR y Enviar a Clientes
        </h3>
        
        <div className="space-y-4">
          {tramiteData.status === 'editando' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-yellow-600">⚠️</span>
                <h4 className="font-medium text-yellow-800">Completar información</h4>
              </div>
              <p className="text-sm text-yellow-700 mb-3">
                Complete la información de contacto básica para ambas partes antes de generar el QR.
              </p>
              <button
                onClick={handleGenerateQR}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                ✅ Marcar como Listo para Envío
              </button>
            </div>
          )}

          {tramiteData.status === 'listo-envio' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-blue-600">📱</span>
                <h4 className="font-medium text-blue-800">Enlaces de Acceso Generados</h4>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {tramiteData.qrUrl && (
                  <div className="flex items-center justify-between bg-white p-3 rounded border border-blue-300 text-sm">
                    <span className="truncate mr-2">{tramiteData.qrUrl}</span>
                    <div className="flex gap-2">
                      <button onClick={() => copyToClipboard(tramiteData.qrUrl)} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">Copiar</button>
                      <button onClick={() => window.open(tramiteData.qrUrl, '_blank')} className="px-2 py-1 bg-green-600 text-white text-xs rounded">Abrir</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tramiteData.status === 'enviado' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-green-600">✅</span>
                <h4 className="font-medium text-green-800">Enviado a Clientes</h4>
              </div>
              <p className="text-sm text-green-700">
                El sistema de cola está activo. Los clientes pueden acceder con el QR para completar su información.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TramiteManager
