import React, { useState } from 'react'
import { motion } from 'framer-motion'
import UAFEFormComplete from './UAFEFormComplete'

interface ClientQueueProps {
  tramiteNumber: string
  tramiteData?: any
}

interface QueueItem {
  id: string
  tramiteNumber: string
  comprador: {
    nombres: string
    apellidos: string
    cedula: string
    status: 'pendiente' | 'en-proceso' | 'completado'
  }
  vendedor: {
    nombres: string
    apellidos: string
    cedula: string
    status: 'pendiente' | 'en-proceso' | 'completado'
  }
  actoContrato: string
  valorContrato: string
}

const ClientQueue: React.FC<ClientQueueProps> = ({ tramiteNumber, tramiteData }) => {
  const [selectedRole, setSelectedRole] = useState<'comprador' | 'vendedor' | null>(null)
  const [currentStep, setCurrentStep] = useState<'selection' | 'form' | 'completed'>('selection')
  const [formData, setFormData] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Datos dinámicos del trámite (en producción vendría del backend)
  const [queueData] = useState<QueueItem>(() => {
    // Si tenemos tramiteData, usamos sus datos extraídos
    if (tramiteData?.extractedData) {
      return {
        id: tramiteData.id || '123',
        tramiteNumber: tramiteNumber || tramiteData.numeroTramite || 'TR-123456',
        comprador: {
          nombres: tramiteData.extractedData.comprador?.nombres || 'SIN DATOS',
          apellidos: tramiteData.extractedData.comprador?.apellidos || '',
          cedula: tramiteData.extractedData.comprador?.cedula || '0000000000',
          status: 'pendiente'
        },
        vendedor: {
          nombres: tramiteData.extractedData.vendedor?.nombres || 'SIN DATOS',
          apellidos: tramiteData.extractedData.vendedor?.apellidos || '',
          cedula: tramiteData.extractedData.vendedor?.cedula || '0000000000',
          status: 'pendiente'
        },
        actoContrato: tramiteData.extractedData.actoContrato || 'COMPRAVENTA',
        valorContrato: tramiteData.extractedData.valorContrato || '0.00'
      }
    } else {
      // Fallback: datos por defecto si no hay tramiteData disponible
      return {
        id: '123',
        tramiteNumber: tramiteNumber || 'TR-123456',
        comprador: {
          nombres: 'SIN DATOS DE TRAMITE',
          apellidos: '',
          cedula: '0000000000',
          status: 'pendiente'
        },
        vendedor: {
          nombres: 'SIN DATOS DE TRAMITE',
          apellidos: '',
          cedula: '0000000000',
          status: 'pendiente'
        },
        actoContrato: 'COMPRAVENTA',
        valorContrato: '0.00'
      }
    }
  })

  const handleRoleSelection = (role: 'comprador' | 'vendedor') => {
    setSelectedRole(role)
    setCurrentStep('form')
    
    // Prellenar algunos datos conocidos
    const personData = queueData[role]
    setFormData({
      // Datos básicos prellenados
      nombres: personData.nombres,
      apellidos: personData.apellidos,
      cedula: personData.cedula,
      
      // Información del trámite (prellenado)
      avaluoMunicipal: '',
      valorContrato: queueData.valorContrato,
      
      // Forma de pago
      formaPago: {
        cheque: false,
        chequeMonto: '',
        chequeBanco: '',
        efectivo: false,
        efectivoMonto: '',
        transferencia: false,
        transferenciaMonto: '',
        transferenciaBanco: '',
        tarjeta: false,
        tarjetaMonto: '',
        tarjetaBanco: ''
      },
      
      // Tipo de participación
      tipoParticipacion: '', // COMPRADOR, VENDEDOR, POR SUS PROPIOS DERECHOS, REPRESENTANDO A
      representandoA: '',
      
      // Tipo de identificación
      tipoIdentificacion: 'cedula', // cedula, ruc, pasaporte
      numeroIdentificacion: personData.cedula,
      nacionalidad: 'ECUATORIANA',
      estadoCivil: '',
      
      // Género y educación
      genero: '',
      nivelEstudio: '', // bachiller, universitario, maestria, postgrado
      
      // Dirección completa
      callePrincipal: '',
      numeroCasa: '',
      calleSecundaria: '',
      direccionCompleta: '',
      
      // Contacto
      correoElectronico: '',
      telefono: '',
      celular: '',
      
      // Información laboral
      situacionLaboral: '', // publico, privado, jubilado, no aplica
      relacionDependencia: '', // si, no
      nombreEntidad: '',
      fechaIngreso: '',
      direccionTrabajo: '',
      provinciaTrabajo: '',
      cantonTrabajo: '',
      profesionOcupacion: '',
      cargo: '',
      ingresoMensual: '',
      
      // Datos del cónyuge (si aplica)
      conyugeApellidos: '',
      conyugeNombres: '',
      conyugeTipoIdentificacion: '',
      conyugeNumeroIdentificacion: '',
      conyugeNacionalidad: '',
      conyugeNivelEstudio: '',
      conyugeGenero: '',
      conyugeEstadoCivil: '',
      conyugeCorreo: '',
      conyugeCelular: '',
      conyugeProfesion: '',
      conyugeDireccion: '',
      
      // Información laboral del cónyuge
      conyugeSituacionLaboral: '',
      conyugeRelacionDependencia: '',
      conyugeNombreEntidad: '',
      conyugeFechaIngreso: '',
      conyugeDireccionTrabajo: '',
      conyugeProvinciaTrabajo: '',
      conyugeCantonTrabajo: '',
      
      // Beneficiario final apoderado/representado (si aplica)
      beneficiarioApellidos: '',
      beneficiarioNombres: '',
      beneficiarioTipoIdentificacion: '',
      beneficiarioNumeroIdentificacion: '',
      beneficiarioNacionalidad: '',
      beneficiarioEstadoCivil: '',
      beneficiarioGenero: '',
      beneficiarioNivelEstudio: '',
      beneficiarioProfesion: '',
      beneficiarioDireccion: '',
      beneficiarioCorreo: '',
      beneficiarioTelefono: '',
      beneficiarioCelular: '',
      
      // Personas Expuestas Políticamente (PEP)
      esPersonaExpuesta: false,
      esFamiliarPEP: false,
      familiarPEPTipo: '', // conyuge_conviviente, padre_madre, hijo_hija, etc.
      familiarPEPGrado: '', // 1er_grado_afinidad, 2do_grado_consanguinidad, etc.
      esColaboradorPEP: false,
      colaboradorTipo: '', // asistente, asesor, otra_persona_confianza
      
      // Campos adicionales para validación
      fechaNacimiento: '',
      lugarNacimiento: ''
    })
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simular envío al backend
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Aquí se enviaría la información al backend
    console.log('Datos del cliente enviados:', {
      tramiteNumber,
      role: selectedRole,
      data: formData
    })
    
    setCurrentStep('completed')
    setIsSubmitting(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <span className="text-yellow-500">⏳</span>
      case 'en-proceso':
        return <span className="text-blue-500">🔄</span>
      case 'completado':
        return <span className="text-green-500">✅</span>
      default:
        return <span className="text-gray-500">❓</span>
    }
  }

  if (currentStep === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-2xl w-full p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sistema Notarial Digital
            </h1>
            <p className="text-gray-600">
              Trámite #{queueData.tramiteNumber}
            </p>
          </div>

          {/* Información del trámite */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-medium text-gray-800 mb-2">Información del Trámite</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>Tipo:</strong> {queueData.actoContrato}</div>
              <div><strong>Valor:</strong> ${queueData.valorContrato}</div>
            </div>
          </div>

          {/* Selección de rol */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900 text-center mb-6">
              Seleccione su rol en la transacción:
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opción Vendedor */}
              <motion.button
                onClick={() => handleRoleSelection('vendedor')}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">👤</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 mb-2">
                    SOY EL VENDEDOR
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="font-medium">{queueData.vendedor.nombres}</div>
                    <div className="font-medium">{queueData.vendedor.apellidos}</div>
                    <div className="text-xs">CI: {queueData.vendedor.cedula}</div>
                  </div>
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    {getStatusIcon(queueData.vendedor.status)}
                    <span className="text-xs text-gray-500 capitalize">
                      {queueData.vendedor.status}
                    </span>
                  </div>
                </div>
              </motion.button>

              {/* Opción Comprador */}
              <motion.button
                onClick={() => handleRoleSelection('comprador')}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🏠</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-700 mb-2">
                    SOY EL COMPRADOR
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="font-medium">{queueData.comprador.nombres}</div>
                    <div className="font-medium">{queueData.comprador.apellidos}</div>
                    <div className="text-xs">CI: {queueData.comprador.cedula}</div>
                  </div>
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    {getStatusIcon(queueData.comprador.status)}
                    <span className="text-xs text-gray-500 capitalize">
                      {queueData.comprador.status}
                    </span>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Seleccione la opción que corresponde a su participación en este trámite notarial</p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (currentStep === 'form') {
    return (
      <UAFEFormComplete
        tramiteNumber={queueData.tramiteNumber}
        selectedRole={selectedRole!}
        extractedData={queueData}
        onSubmit={handleSubmit}
        onBack={() => setCurrentStep('selection')}
      />
    )
  }

  // Fallback - no debería llegar aquí
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Estado no válido</h2>
        <p className="text-gray-600 mt-2">Por favor, recargue la página</p>
        <button
          onClick={() => setCurrentStep('selection')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}

export default ClientQueue