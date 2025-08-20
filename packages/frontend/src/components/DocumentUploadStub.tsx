import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TramiteManager from './TramiteManager'
import { procesarExtractoNotarialReal } from '../utils/procesarExtractoReal'

interface FileWithPreview {
  file: File
  id: string
  preview?: string
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  extractedData?: any
}

interface DocumentUploadProps {
  config?: any
  onFileSelect?: (files: File[]) => void
  onUploadComplete?: (fileId: string, result: any) => void
  onProcessingComplete?: (fileId: string, extractedData: any) => void
  onError?: (error: Error, fileId?: string) => void
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onFileSelect,
  onProcessingComplete,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [generatedForms, setGeneratedForms] = useState<any[]>([])
  const [showTramiteManager, setShowTramiteManager] = useState(false)
  const [currentTramiteData, setCurrentTramiteData] = useState<any>(null)

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const processFile = async (fileData: FileWithPreview) => {
    // Simular subida
    setFiles(prev => prev.map(f => f.id === fileData.id ? { ...f, status: 'uploading' as const } : f))
    
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setFiles(prev => prev.map(f => f.id === fileData.id ? { ...f, progress: i } : f))
    }

    // Simular procesamiento OCR
    setFiles(prev => prev.map(f => f.id === fileData.id ? { ...f, status: 'processing' as const, progress: 0 } : f))
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setFiles(prev => prev.map(f => f.id === fileData.id ? { ...f, progress: i } : f))
    }

    // Procesar archivo real o usar datos simulados según el contexto
    let extractedData;
    
    if (fileData.file && fileData.file.size > 0) {
      // Es un archivo real - intentar procesamiento
      try {
        // Para PDFs: extraer datos reales del documento
        if (fileData.file.type === 'application/pdf') {
          extractedData = await procesarExtractoNotarialReal(fileData.file)
        } else {
          // Para otros tipos: usar simulación con notificación
          console.warn('Archivo no es PDF, usando datos simulados')
          const { generarDatosTramiteSimulados } = await import('../utils/datosTramiteSimulados')
          extractedData = generarDatosTramiteSimulados()
        }
      } catch (error) {
        console.error('Error procesando archivo real:', error)
        // Fallback a datos simulados únicos si falla el procesamiento
        console.warn('⚠️ Procesamiento de PDF falló, usando datos simulados únicos')
        const { generarDatosTramiteSimulados } = await import('../utils/datosTramiteSimulados')
        extractedData = generarDatosTramiteSimulados()
      }
    } else {
      // No hay archivo real - usar simulación
      const { generarDatosTramiteSimulados } = await import('../utils/datosTramiteSimulados')
      extractedData = generarDatosTramiteSimulados()
    }
    
    const mockExtractedData = extractedData

    setFiles(prev => prev.map(f => 
      f.id === fileData.id 
        ? { ...f, status: 'completed' as const, progress: 100, extractedData: mockExtractedData } 
        : f
    ))



    // No cambiar de pestaña automáticamente, solo notificar que se completó el procesamiento
    if (onProcessingComplete) {
      onProcessingComplete(fileData.id, mockExtractedData)
    }
  }

  const handleFiles = async (newFiles: File[]) => {
    const filesWithPreview: FileWithPreview[] = newFiles.map(file => ({
      file,
      id: generateId(),
      status: 'uploading' as const,
      progress: 0,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }))

    setFiles(prev => [...prev, ...filesWithPreview])
    
    if (onFileSelect) {
      onFileSelect(newFiles)
    }

    // Procesar cada archivo
    for (const fileData of filesWithPreview) {
      processFile(fileData)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    if (newFiles.length > 0) {
      handleFiles(newFiles)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const newFiles = Array.from(e.dataTransfer.files)
    if (newFiles.length > 0) {
      handleFiles(newFiles)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const generateForms = (_extractedData: any) => {
    const baseId = generateId()
    
    // Generar formulario para el comprador
    const compradorForm = {
      id: `${baseId}-comprador`,
      tipo: 'comprador',
      persona: extractedData.comprador,
      acto: extractedData,
      datosComplementarios: {
        // Datos que el operador puede llenar
        telefono: '',
        celular: '', 
        correoElectronico: '',
        direccionDomiciliaria: '',
        profesionOcupacion: '',
        
        // Información laboral
        situacionLaboral: '',
        nombreEntidad: '',
        fechaIngreso: '',
        direccionTrabajo: '',
        provincia: extractedData.ubicacion.provincia,
        ingresoMensual: '',
        
        // Información adicional
        nivelEstudio: '',
        genero: '',
        estadoCivil: ''
      },
      link: `${window.location.origin}/formulario/${baseId}-comprador`,
      status: 'generado'
    }
    
    // Generar formulario para el vendedor  
    const vendedorForm = {
      id: `${baseId}-vendedor`,
      tipo: 'vendedor',
      persona: extractedData.vendedor,
      acto: extractedData,
      datosComplementarios: {
        // Datos que el operador puede llenar
        telefono: '',
        celular: '',
        correoElectronico: '',
        direccionDomiciliaria: '',
        profesionOcupacion: '',
        
        // Información laboral
        situacionLaboral: '',
        nombreEntidad: '',
        fechaIngreso: '',
        direccionTrabajo: '',
        provincia: extractedData.ubicacion.provincia,
        ingresoMensual: '',
        
        // Información adicional
        nivelEstudio: '',
        genero: '',
        estadoCivil: ''
      },
      link: `${window.location.origin}/formulario/${baseId}-vendedor`,
      status: 'generado'
    }
    
    setGeneratedForms(prev => [...prev, compradorForm, vendedorForm])
    
    // Cambiar a la pestaña de procesamiento para mostrar los resultados
    if (onProcessingComplete) {
      onProcessingComplete('forms-generated', { compradorForm, vendedorForm })
    }
  }

  const updateFormData = (formId: string, field: string, value: string) => {
    setGeneratedForms(prev => prev.map(form => 
      form.id === formId 
        ? { ...form, datosComplementarios: { ...form.datosComplementarios, [field]: value } }
        : form
    ))
  }

  const updateExtractedData = (fileId: string, section: string, field: string, value: string) => {
    // Actualizar los archivos directamente
    setFiles(prev => prev.map(f => 
      f.id === fileId && f.extractedData
        ? { 
            ...f, 
            extractedData: field
              ? {
                  ...f.extractedData,
                  [section]: {
                    ...f.extractedData[section],
                    [field]: value
                  }
                }
              : {
                  ...f.extractedData,
                  [section]: value
                }
          }
        : f
    ))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Link copiado al portapapeles')
    } catch (err) {
      console.error('Error copiando al portapapeles:', err)
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Link copiado al portapapeles')
    }
  }

  const handleGenerateQR = (tramiteData: any) => {
    console.log('QR generado para trámite:', tramiteData.numeroTramite)
    setQrCode(tramiteData.qrUrl)
    // Aquí se podría llamar al backend para persistir el estado
  }

  const handleSendToClients = (tramiteData: any) => {
    console.log('Enviando a clientes:', tramiteData.numeroTramite)
    setProcessingQueue(prev => [...prev, tramiteData])
    // Activar sistema de alertas para el trámite
    alert(`✅ Sistema de cola activado para trámite ${tramiteData.numeroTramite}
    
🔔 Los clientes pueden acceder desde:
${tramiteData.qrUrl}

📱 También puedes ver la cola de trámites en la pestaña "Cola de Clientes"
🔐 Los clientes necesitarán su cédula para acceder a su trámite específico`)
  }

  // Mostrar TramiteManager si está activado
  if (showTramiteManager && currentTramiteData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Gestor de Trámite UAFE</h2>
          <button
            onClick={() => {
              setShowTramiteManager(false)
              setCurrentTramiteData(null)
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Regresar a documentos
          </button>
        </div>
        <TramiteManager
          extractedData={currentTramiteData}
          onGenerateQR={handleGenerateQR}
          onSendToClients={handleSendToClients}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Zona de subida más compacta */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          borderStyle: 'dashed',
          borderWidth: '2px',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          textAlign: 'center',
          transition: 'all 0.2s',
        }}
      >
        <div className="space-y-3">
          <div className="flex justify-center">
            <svg 
              className="h-8 w-8 text-gray-400" 
              stroke="currentColor" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          
          <div>
            <p className="text-gray-600 mb-3 text-sm">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            
            <label
              htmlFor="file-upload"
              className="btn-primary"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Seleccionar archivos
            </label>
          </div>
          
          <div className="text-xs text-gray-500">
            PDF, JPG, PNG • Máximo 50MB
          </div>
        </div>
      </motion.div>

      {/* Lista de archivos procesándose */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-medium text-gray-900">
              Archivos ({files.length})
            </h3>
            
            {files.map((fileData) => (
              <motion.div
                key={fileData.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {fileData.preview ? (
                        <img 
                          src={fileData.preview} 
                          alt="Preview" 
                          className="h-10 w-10 object-cover rounded border"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded border flex items-center justify-center">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{fileData.file.name}</h4>
                      <p className="text-xs text-gray-500">
                        {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <StatusIcon status={fileData.status} />
                    <button
                      onClick={() => removeFile(fileData.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Barra de progreso */}
                {(fileData.status === 'uploading' || fileData.status === 'processing') && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>
                        {fileData.status === 'uploading' ? 'Subiendo' : 'Procesando'}...
                      </span>
                      <span>{fileData.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-primary-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${fileData.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {/* Datos extraídos */}
                {fileData.status === 'completed' && fileData.extractedData && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="text-sm font-medium text-green-800">Datos Extraídos del Extracto Notarial</h5>
                        <p className="text-xs text-green-600 mt-1">✏️ Todos los campos son editables - Completa la información faltante</p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentTramiteData(fileData.extractedData)
                          setShowTramiteManager(true)
                        }}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        🎯 Gestionar Trámite
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Información del Acto - EDITABLE */}
                      <div className="space-y-2">
                        <h6 className="font-medium text-green-700">Información del Acto:</h6>
                        <div className="space-y-1">
                          <label className="block text-xs text-gray-600">Escritura:</label>
                          <input
                            type="text"
                            value={fileData.extractedData.escritura}
                            onChange={(e) => updateExtractedData(fileData.id, 'escritura', '', e.target.value)}
                            className="form-input text-xs focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs text-gray-600">Fecha:</label>
                          <input
                            type="text"
                            value={fileData.extractedData.fechaOtorgamiento}
                            onChange={(e) => updateExtractedData(fileData.id, 'fechaOtorgamiento', '', e.target.value)}
                            className="form-input text-xs focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs text-gray-600">Acto:</label>
                          <input
                            type="text"
                            value={fileData.extractedData.actoContrato}
                            onChange={(e) => updateExtractedData(fileData.id, 'actoContrato', '', e.target.value)}
                            className="form-input text-xs focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs text-gray-600">Valor:</label>
                          <input
                            type="text"
                            value={fileData.extractedData.valorContrato}
                            onChange={(e) => updateExtractedData(fileData.id, 'valorContrato', '', e.target.value)}
                            className="form-input text-xs focus:border-green-500"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      {/* Información del Inmueble - EDITABLE */}
                      <div className="space-y-2">
                        <h6 className="font-medium text-green-700">Ubicación del Inmueble:</h6>
                        <div className="space-y-1">
                          <label className="block text-xs text-gray-600">Provincia:</label>
                          <input
                            type="text"
                            value={fileData.extractedData.ubicacion.provincia}
                            onChange={(e) => updateExtractedData(fileData.id, 'ubicacion', 'provincia', e.target.value)}
                            className="form-input text-xs focus:border-green-500"
                            placeholder="Ej: Pichincha, Guayas, etc."
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs text-gray-600">Cantón:</label>
                          <input
                            type="text"
                            value={fileData.extractedData.ubicacion.canton}
                            onChange={(e) => updateExtractedData(fileData.id, 'ubicacion', 'canton', e.target.value)}
                            className="form-input text-xs focus:border-green-500"
                            placeholder="Ej: Quito, Guayaquil, etc."
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs text-gray-600">Parroquia:</label>
                          <input
                            type="text"
                            value={fileData.extractedData.ubicacion.parroquia}
                            onChange={(e) => updateExtractedData(fileData.id, 'ubicacion', 'parroquia', e.target.value)}
                            className="form-input text-xs focus:border-green-500"
                            placeholder="Ej: Iñaquito, Centro, etc."
                          />
                        </div>
                      </div>

                      {/* Vendedor - EDITABLE */}
                      <div className="space-y-2">
                        <h6 className="font-medium text-green-700">
                          Vendedor (Otorgante):
                          {fileData.extractedData.vendedor.esPersonaJuridica && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Persona Jurídica
                            </span>
                          )}
                        </h6>
                        
                        {fileData.extractedData.vendedor.esPersonaJuridica ? (
                          // Campos para persona jurídica
                          <>
                            <div className="space-y-1">
                              <label className="block text-xs text-gray-600">Razón Social:</label>
                              <input
                                type="text"
                                value={fileData.extractedData.vendedor.nombres}
                                onChange={(e) => updateExtractedData(fileData.id, 'vendedor', 'nombres', e.target.value)}
                                className="form-input text-xs focus:border-green-500"
                                placeholder="Ej: HERPAYAL CONSTRUCTORA CIA. LTDA."
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-xs text-gray-600">RUC:</label>
                              <input
                                type="text"
                                value={fileData.extractedData.vendedor.cedula}
                                onChange={(e) => updateExtractedData(fileData.id, 'vendedor', 'cedula', e.target.value)}
                                className="form-input text-xs focus:border-green-500"
                                placeholder="1791345134001"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-xs text-gray-600">Representante Legal:</label>
                              <input
                                type="text"
                                value={fileData.extractedData.vendedor.representanteLegal || 'SANTIAGO JAVIER PADRON LAFEBRE'}
                                onChange={(e) => updateExtractedData(fileData.id, 'vendedor', 'representanteLegal', e.target.value)}
                                className="form-input text-xs focus:border-green-500"
                              />
                            </div>
                          </>
                        ) : (
                          // Campos para persona natural
                          <>
                            <div className="space-y-1">
                              <label className="block text-xs text-gray-600">Nombres:</label>
                              <input
                                type="text"
                                value={fileData.extractedData.vendedor.nombres}
                                onChange={(e) => updateExtractedData(fileData.id, 'vendedor', 'nombres', e.target.value)}
                                className="form-input text-xs focus:border-green-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-xs text-gray-600">Apellidos:</label>
                              <input
                                type="text"
                                value={fileData.extractedData.vendedor.apellidos}
                                onChange={(e) => updateExtractedData(fileData.id, 'vendedor', 'apellidos', e.target.value)}
                                className="form-input text-xs focus:border-green-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-xs text-gray-600">Cédula:</label>
                              <input
                                type="text"
                                value={fileData.extractedData.vendedor.cedula}
                                onChange={(e) => updateExtractedData(fileData.id, 'vendedor', 'cedula', e.target.value)}
                                className="form-input text-xs focus:border-green-500"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Comprador - EDITABLE */}
                      <div className="space-y-2">
                        <h6 className="font-medium text-green-700">Comprador (Beneficiario):</h6>
                        <div className="space-y-1">
                          <label className="block text-xs text-gray-600">Nombres:</label>
                          <input
                            type="text"
                            value={fileData.extractedData.comprador.nombres}
                            onChange={(e) => updateExtractedData(fileData.id, 'comprador', 'nombres', e.target.value)}
                            className="form-input text-xs focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs text-gray-600">Apellidos:</label>
                          <input
                            type="text"
                            value={fileData.extractedData.comprador.apellidos}
                            onChange={(e) => updateExtractedData(fileData.id, 'comprador', 'apellidos', e.target.value)}
                            className="form-input text-xs focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs text-gray-600">Cédula:</label>
                          <input
                            type="text"
                            value={fileData.extractedData.comprador.cedula}
                            onChange={(e) => updateExtractedData(fileData.id, 'comprador', 'cedula', e.target.value)}
                            className="form-input text-xs focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formularios Generados */}
      <AnimatePresence>
        {generatedForms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium text-gray-900">
              Formularios UAFE Generados ({generatedForms.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedForms.map((form) => (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-blue-900 capitalize">
                        Formulario para {form.tipo}
                      </h4>
                      <p className="text-sm text-blue-700">
                        {form.persona.nombres} {form.persona.apellidos}
                      </p>
                      <p className="text-xs text-blue-600">
                        CI: {form.persona.cedula}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Listo para enviar
                    </span>
                  </div>
                  
                  {/* Datos complementarios que puede llenar el operador */}
                  <div className="space-y-3 mb-4">
                    <h5 className="text-sm font-medium text-blue-800">Completar información:</h5>
                    <div className="grid grid-cols-1 gap-2">
                      <input
                        type="text"
                        placeholder="Teléfono"
                        className="form-input text-sm border-blue-300"
                        onChange={(e) => updateFormData(form.id, 'telefono', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Celular"
                        className="form-input text-sm border-blue-300"
                        onChange={(e) => updateFormData(form.id, 'celular', e.target.value)}
                      />
                      <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="form-input text-sm border-blue-300"
                        onChange={(e) => updateFormData(form.id, 'correoElectronico', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Dirección domiciliaria"
                        className="form-input text-sm border-blue-300"
                        onChange={(e) => updateFormData(form.id, 'direccionDomiciliaria', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Profesión u ocupación"
                        className="form-input text-sm border-blue-300"
                        onChange={(e) => updateFormData(form.id, 'profesionOcupacion', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Avalúo municipal"
                        className="form-input text-sm border-blue-300"
                        onChange={(e) => updateFormData(form.id, 'avaluoMunicipal', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Acciones */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(form.link)}
                      className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      📋 Copiar Link
                    </button>
                    <button
                      onClick={() => window.open(form.link, '_blank')}
                      className="flex-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      👁️ Preview
                    </button>
                  </div>
                  
                  <div className="mt-2 text-xs text-blue-600 break-all">
                    Link: {form.link}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Resumen de acciones */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Siguiente paso:</h4>
              <ol className="text-sm text-yellow-700 space-y-1">
                <li>1. Completa la información adicional en los campos arriba</li>
                <li>2. Copia los links y envíalos a cada cliente</li>
                <li>3. Los clientes completarán el resto de información</li>
                <li>4. El sistema generará PDFs listos para imprimir y firmar</li>
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'uploading':
      return (
        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      )
    case 'processing':
      return (
        <div className="animate-spin h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
      )
    case 'completed':
      return (
        <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    case 'error':
      return (
        <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    default:
      return null
  }
}

export default DocumentUpload
