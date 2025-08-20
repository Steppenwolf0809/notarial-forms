import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface UAFEFormProps {
  tramiteNumber: string
  selectedRole: 'comprador' | 'vendedor'
  extractedData: any
  onSubmit: (formData: any) => void
  onBack: () => void
}

const UAFEFormComplete: React.FC<UAFEFormProps> = ({
  tramiteNumber,
  selectedRole,
  extractedData,
  onSubmit,
  onBack
}) => {
  const [formData, setFormData] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)

  const sections = [
    'Información del Trámite',
    'Forma de Pago', 
    'Datos Personales',
    'Información Laboral'
  ]

  useEffect(() => {
    // Inicializar formulario con datos prellenados del extracto
    const personData = extractedData[selectedRole]
    setFormData({
      // Datos básicos prellenados
      nombres: personData?.nombres || '',
      apellidos: personData?.apellidos || '',
      cedula: personData?.cedula || '',
      
      // Información del trámite
      fecha: extractedData.fechaOtorgamiento || '',
      numeroMatriz: extractedData.escritura || '',
      actoContrato: extractedData.actoContrato || '',
      avaluoMunicipal: '',
      valorContrato: extractedData.valorContrato || '',
      
      // Múltiples formas de pago
      formasPago: [],
      totalPagos: 0,
      
      // Tipo de participación
      tipoParticipacion: selectedRole === 'comprador' ? 'COMPRADOR' : 'VENDEDOR',
      representandoA: '',
      
      // Datos personales
      tipoIdentificacion: 'cedula',
      numeroIdentificacion: personData?.cedula || '',
      nacionalidad: personData?.nacionalidad || 'ECUATORIANA',
      estadoCivil: '',
      genero: '',
      nivelEstudio: '',
      
      // Dirección
      callePrincipal: '',
      numeroCasa: '',
      calleSecundaria: '',
      
      // Contacto
      correoElectronico: '',
      telefono: '',
      celular: '',
      
      // Información laboral
      situacionLaboral: '',
      relacionDependencia: '',
      nombreEntidad: '',
      fechaIngreso: '',
      direccionTrabajo: '',
      provinciaTrabajo: '',
      profesionOcupacion: '',
      cargo: '',
      ingresoMensual: ''
    })
  }, [extractedData, selectedRole])

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  const agregarFormaPago = () => {
    const nuevaFormaPago = {
      id: Date.now().toString(),
      tipo: '',
      monto: '',
      banco: '',
      numeroDocumento: '',
      fecha: ''
    }
    
    setFormData((prev: any) => ({
      ...prev,
      formasPago: [...prev.formasPago, nuevaFormaPago]
    }))
  }

  const eliminarFormaPago = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      formasPago: prev.formasPago.filter((pago: any) => pago.id !== id)
    }))
    calcularTotalPagos()
  }

  const actualizarFormaPago = (id: string, campo: string, valor: any) => {
    setFormData((prev: any) => ({
      ...prev,
      formasPago: prev.formasPago.map((pago: any) => 
        pago.id === id ? { ...pago, [campo]: valor } : pago
      )
    }))
    // Recalcular total cuando cambie un monto
    if (campo === 'monto') {
      setTimeout(() => calcularTotalPagos(), 100)
    }
  }

  const calcularTotalPagos = () => {
    const total = formData.formasPago?.reduce((sum: number, pago: any) => {
      const monto = parseFloat(pago.monto) || 0
      return sum + monto
    }, 0) || 0
    
    updateFormData('totalPagos', total)
  }

  const getValidacionPagos = () => {
    const valorContrato = parseFloat(formData.valorContrato) || 0
    const totalPagos = formData.totalPagos || 0
    const diferencia = valorContrato - totalPagos
    
    return {
      valorContrato,
      totalPagos,
      diferencia,
      completo: Math.abs(diferencia) < 0.01, // Permitir diferencia menor a 1 centavo
      sobrante: diferencia < 0,
      faltante: diferencia > 0.01
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Datos del formulario UAFE enviados:', {
        tramiteNumber,
        role: selectedRole,
        data: formData
      })
      onSubmit(formData)
    } catch (error) {
      console.error('Error enviando formulario:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSectionProgress = () => {
    const totalFields = Object.keys(formData).length
    const completedFields = Object.values(formData).filter(value => 
      value !== '' && value !== false && value !== null && value !== undefined
    ).length
    return Math.round((completedFields / totalFields) * 100)
  }

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">
                  FORMULARIO DE DEBIDA DILIGENCIA "CONOZCA A SU USUARIO"
                </h1>
                <p className="text-blue-100">
                  PERSONAS NATURALES - Trámite #{tramiteNumber}
                </p>
              </div>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors"
              >
                ← Regresar
              </button>
            </div>

            <div className="bg-blue-100 text-blue-800 p-3 rounded-lg text-sm">
              <p className="mb-2">
                <strong>La Unidad de Análisis Financiero y Económico UAFE</strong>, en cumplimiento a las políticas internas de prevención de lavado de activos, requiere la entrega de la siguiente información (favor completar todos los campos obligatoriamente).
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progreso del formulario: {getSectionProgress()}%
              </span>
              <span className="text-sm text-gray-500">
                Sección {currentSection + 1} de {sections.length}: {sections[currentSection]}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getSectionProgress()}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Sección 0: Información del Trámite */}
                {currentSection === 0 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 bg-blue-100 p-3 rounded">
                      📋 INFORMACIÓN DEL TRÁMITE
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha:</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          value={formData.fecha}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">No. Matriz:</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          value={formData.numeroMatriz}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Acto / Contrato Diligencia:</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          value={formData.actoContrato}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Avalúo Municipal: *</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          value={formData.avaluoMunicipal || ''}
                          onChange={(e) => updateFormData('avaluoMunicipal', e.target.value)}
                          placeholder="Ingrese avalúo municipal"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor del Contrato:</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          value={`$${formData.valorContrato}`}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sección 1: Múltiples Formas de Pago */}
                {currentSection === 1 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-gray-900 bg-blue-100 p-3 rounded">
                        💳 FORMAS DE PAGO MÚLTIPLES
                      </h2>
                      <button
                        onClick={agregarFormaPago}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <span>➕</span>
                        <span>Agregar Forma de Pago</span>
                      </button>
                    </div>
                    
                    {/* Resumen financiero */}
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <h4 className="font-medium text-gray-700">Valor del Contrato</h4>
                          <p className="text-2xl font-bold text-blue-600">
                            ${parseFloat(formData.valorContrato || 0).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">Total Pagos Registrados</h4>
                          <p className="text-2xl font-bold text-green-600">
                            ${(formData.totalPagos || 0).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">
                            {(() => {
                              const validacion = getValidacionPagos()
                              if (validacion.completo) return "✅ Coincide"
                              if (validacion.faltante) return "⚠️ Falta"
                              if (validacion.sobrante) return "⚠️ Sobra"
                              return "Diferencia"
                            })()}
                          </h4>
                          <p className={`text-2xl font-bold ${
                            (() => {
                              const validacion = getValidacionPagos()
                              if (validacion.completo) return "text-green-600"
                              return "text-red-600"
                            })()
                          }`}>
                            ${Math.abs(getValidacionPagos().diferencia).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Alertas de validación */}
                      {(() => {
                        const validacion = getValidacionPagos()
                        if (validacion.faltante) {
                          return (
                            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                              <p className="text-yellow-800">
                                ⚠️ <strong>Faltan ${validacion.diferencia.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</strong> por registrar para completar el valor del contrato.
                              </p>
                            </div>
                          )
                        }
                        if (validacion.sobrante) {
                          return (
                            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                              <p className="text-red-800">
                                ❌ <strong>Hay ${Math.abs(validacion.diferencia).toLocaleString('es-EC', { minimumFractionDigits: 2 })} de sobra</strong>. Los pagos superan el valor del contrato.
                              </p>
                            </div>
                          )
                        }
                        if (validacion.completo) {
                          return (
                            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                              <p className="text-green-800">
                                ✅ <strong>Perfecto!</strong> Los pagos coinciden exactamente con el valor del contrato.
                              </p>
                            </div>
                          )
                        }
                        return null
                      })()}
                    </div>

                    {/* Lista de formas de pago */}
                    <div className="space-y-4">
                      {formData.formasPago?.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                          <div className="text-4xl mb-2">💳</div>
                          <p className="text-gray-500 mb-4">No hay formas de pago registradas</p>
                          <button
                            onClick={agregarFormaPago}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Agregar Primera Forma de Pago
                          </button>
                        </div>
                      ) : (
                        formData.formasPago?.map((pago: any, index: number) => (
                          <motion.div
                            key={pago.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-medium text-gray-800">
                                Forma de Pago #{index + 1}
                              </h4>
                              <button
                                onClick={() => eliminarFormaPago(pago.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                🗑️ Eliminar
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pago:</label>
                                <select
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                  value={pago.tipo || ''}
                                  onChange={(e) => actualizarFormaPago(pago.id, 'tipo', e.target.value)}
                                >
                                  <option value="">Seleccionar...</option>
                                  <option value="efectivo">💵 Efectivo</option>
                                  <option value="cheque">📝 Cheque</option>
                                  <option value="transferencia">🏦 Transferencia Bancaria</option>
                                  <option value="tarjeta">💳 Tarjeta de Crédito/Débito</option>
                                  <option value="credito">📄 Crédito Hipotecario</option>
                                  <option value="permuta">🔄 Permuta (Parte)</option>
                                  <option value="otro">❓ Otro</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Monto (USD): *</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                  value={pago.monto || ''}
                                  onChange={(e) => actualizarFormaPago(pago.id, 'monto', e.target.value)}
                                  placeholder="0.00"
                                />
                              </div>
                              
                              {(pago.tipo === 'cheque' || pago.tipo === 'transferencia' || pago.tipo === 'tarjeta' || pago.tipo === 'credito') && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {pago.tipo === 'cheque' ? 'Banco del Cheque:' : 
                                     pago.tipo === 'credito' ? 'Institución Financiera:' : 'Banco:'}
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    value={pago.banco || ''}
                                    onChange={(e) => actualizarFormaPago(pago.id, 'banco', e.target.value)}
                                    placeholder={pago.tipo === 'credito' ? 'Ej: Banco Pichincha' : 'Nombre del banco'}
                                  />
                                </div>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              {(pago.tipo === 'cheque' || pago.tipo === 'transferencia') && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {pago.tipo === 'cheque' ? 'Número de Cheque:' : 'Número de Transacción:'}
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    value={pago.numeroDocumento || ''}
                                    onChange={(e) => actualizarFormaPago(pago.id, 'numeroDocumento', e.target.value)}
                                    placeholder={pago.tipo === 'cheque' ? 'Ej: 001234567' : 'Ej: TRX123456789'}
                                  />
                                </div>
                              )}
                              
                              {pago.tipo !== 'efectivo' && pago.tipo !== '' && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha del {pago.tipo === 'cheque' ? 'Cheque' : 'Pago'}:
                                  </label>
                                  <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    value={pago.fecha || ''}
                                    onChange={(e) => actualizarFormaPago(pago.id, 'fecha', e.target.value)}
                                  />
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>

                    {/* Botón para agregar más pagos */}
                    {formData.formasPago?.length > 0 && (
                      <div className="text-center">
                        <button
                          onClick={agregarFormaPago}
                          className="px-6 py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          ➕ Agregar Otra Forma de Pago
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Sección 2: Datos Personales */}
                {currentSection === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 bg-blue-100 p-3 rounded">
                      👤 PERSONAS QUE REALIZAN EL ACTO/CONTRATO
                    </h2>
                    
                    {/* Datos básicos prellenados */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-3">Datos Prellenados:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Apellidos:</span>
                          <div className="font-medium">{formData.apellidos}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Nombres:</span>
                          <div className="font-medium">{formData.nombres}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Cédula:</span>
                          <div className="font-medium">{formData.cedula}</div>
                        </div>
                      </div>
                    </div>

                    {/* Campos editables */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidad:</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.nacionalidad || ''}
                          onChange={(e) => updateFormData('nacionalidad', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil:</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.estadoCivil || ''}
                          onChange={(e) => updateFormData('estadoCivil', e.target.value)}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="soltero">Soltero/a</option>
                          <option value="casado">Casado/a</option>
                          <option value="divorciado">Divorciado/a</option>
                          <option value="viudo">Viudo/a</option>
                          <option value="union_libre">Unión libre</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Género:</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.genero || ''}
                          onChange={(e) => updateFormData('genero', e.target.value)}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="masculino">Masculino</option>
                          <option value="femenino">Femenino</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Estudio:</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.nivelEstudio || ''}
                          onChange={(e) => updateFormData('nivelEstudio', e.target.value)}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="bachiller">Bachiller</option>
                          <option value="universitario">Universitario</option>
                          <option value="postgrado">Postgrado</option>
                        </select>
                      </div>
                    </div>

                    {/* Dirección */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">Dirección Domiciliaria:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Calle Principal"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.callePrincipal || ''}
                          onChange={(e) => updateFormData('callePrincipal', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Número"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.numeroCasa || ''}
                          onChange={(e) => updateFormData('numeroCasa', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Calle Secundaria"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.calleSecundaria || ''}
                          onChange={(e) => updateFormData('calleSecundaria', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Contacto */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">Información de Contacto:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="email"
                          placeholder="Correo electrónico *"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.correoElectronico || ''}
                          onChange={(e) => updateFormData('correoElectronico', e.target.value)}
                          required
                        />
                        <input
                          type="tel"
                          placeholder="Teléfono"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.telefono || ''}
                          onChange={(e) => updateFormData('telefono', e.target.value)}
                        />
                        <input
                          type="tel"
                          placeholder="Celular *"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.celular || ''}
                          onChange={(e) => updateFormData('celular', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sección 3: Información Laboral */}
                {currentSection === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 bg-blue-100 p-3 rounded">
                      💼 INFORMACIÓN LABORAL
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Situación Laboral:</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.situacionLaboral || ''}
                          onChange={(e) => updateFormData('situacionLaboral', e.target.value)}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="publico">Sector Público</option>
                          <option value="privado">Sector Privado</option>
                          <option value="independiente">Independiente</option>
                          <option value="jubilado">Jubilado</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Entidad:</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.nombreEntidad || ''}
                          onChange={(e) => updateFormData('nombreEntidad', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profesión/Ocupación:</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.profesionOcupacion || ''}
                          onChange={(e) => updateFormData('profesionOcupacion', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ingreso Mensual (USD):</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.ingresoMensual || ''}
                          onChange={(e) => updateFormData('ingresoMensual', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección del Trabajo:</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={formData.direccionTrabajo || ''}
                        onChange={(e) => updateFormData('direccionTrabajo', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <button
                onClick={prevSection}
                disabled={currentSection === 0}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>

              <div className="flex space-x-2">
                {sections.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSection(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentSection 
                        ? 'bg-blue-600' 
                        : index < currentSection 
                          ? 'bg-green-500' 
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentSection === sections.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    '✅ Enviar Formulario'
                  )}
                </button>
              ) : (
                <button
                  onClick={nextSection}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Siguiente →
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UAFEFormComplete
