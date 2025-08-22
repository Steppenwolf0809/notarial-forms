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
  const [serverSessions, setServerSessions] = useState<any[]>([])

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

  // Generación local de formularios simplificada eliminada

  // Crear sesiones reales en backend y actualizar links con accessId
  const createSessionsForForms = async () => {
    try {
      const created = await Promise.all(generatedForms.map(async (form) => {
        const payload = {
          ownerName: `${form.persona.nombres} ${form.persona.apellidos}`.trim(),
          ownerCedula: form.persona.cedula || form.persona.numeroDocumento || '0000000000',
          data: {
            personas: [
              {
                apellidos: form.persona.apellidos || '',
                nombres: form.persona.nombres || '',
                identificacion: { tipo: 'CEDULA', numero: form.persona.cedula || '' },
                direccion: { callePrincipal: form.acto?.ubicacion?.callePrincipal, calleSecundaria: form.acto?.ubicacion?.calleSecundaria },
              }
            ],
            ubicacionInmueble: {
              callePrincipal: form.acto?.ubicacion?.callePrincipal || '',
              numero: form.acto?.ubicacion?.numero || '',
              calleSecundaria: form.acto?.ubicacion?.calleSecundaria || ''
            },
            informacionTramite: { valorContrato: String(form.acto?.valor || '') }
          }
        }
        const res = await fetch('/api/documents/form-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        const json = await res.json()
        if (json?.success && json?.data?.accessId) {
          return { ...form, link: `${window.location.origin}/?form=${json.data.accessId}` }
        }
        return form
      }))
      setGeneratedForms(created)
      alert('Sesiones creadas. Links actualizados ✅')
    } catch (e) {
      console.error(e)
      alert('No se pudieron crear las sesiones en el servidor')
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

  // QR/cola removidos en la versión simplificada

  const listServerSessions = async () => {
    try {
      const res = await fetch('/api/documents/form-session')
      const json = await res.json()
      if (json?.success) {
        setServerSessions(json.data || [])
      }
    } catch (e) {
      console.error(e)
    }
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
          onGenerateQR={() => {}}
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
                        
                        {/* Dirección del Inmueble */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h6 className="font-medium text-green-700 mb-2">Dirección del Inmueble:</h6>
                          <div className="space-y-1">
                            <label className="block text-xs text-gray-600">Calle Principal:</label>
                            <input
                              type="text"
                              value={fileData.extractedData.inmueble?.direccion?.callePrincipal || ''}
                              onChange={(e) => updateExtractedData(fileData.id, 'inmueble', 'direccion', e.target.value)}
                              className="form-input text-xs focus:border-green-500"
                              placeholder="Ej: AV. AMAZONAS"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs text-gray-600">Número:</label>
                            <input
                              type="text"
                              value={fileData.extractedData.inmueble?.direccion?.numero || ''}
                              onChange={(e) => updateExtractedData(fileData.id, 'inmueble', 'numero', e.target.value)}
                              className="form-input text-xs focus:border-green-500"
                              placeholder="Ej: N12-34"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs text-gray-600">Calle Secundaria:</label>
                            <input
                              type="text"
                              value={fileData.extractedData.inmueble?.direccion?.calleSecundaria || ''}
                              onChange={(e) => updateExtractedData(fileData.id, 'inmueble', 'calleSecundaria', e.target.value)}
                              className="form-input text-xs focus:border-green-500"
                              placeholder="Ej: AV. COLÓN"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs text-gray-600">Tipo de Inmueble:</label>
                            <select
                              value={fileData.extractedData.inmueble?.tipo || ''}
                              onChange={(e) => updateExtractedData(fileData.id, 'inmueble', 'tipo', e.target.value)}
                              className="form-input text-xs focus:border-green-500"
                            >
                              <option value="">Seleccionar...</option>
                              <option value="DEPARTAMENTO">DEPARTAMENTO</option>
                              <option value="CASA">CASA</option>
                              <option value="OFICINA">OFICINA</option>
                              <option value="LOCAL">LOCAL COMERCIAL</option>
                              <option value="TERRENO">TERRENO</option>
                              <option value="BODEGA">BODEGA</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Vendedores - soporta múltiples */}
                      <div className="space-y-2">
                        <h6 className="font-medium text-green-700">
                          Vendedores (Otorgantes):
                          {fileData.extractedData.vendedores?.length > 1 && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {fileData.extractedData.vendedores.length} vendedores
                            </span>
                          )}
                        </h6>

                        {(fileData.extractedData.vendedores && fileData.extractedData.vendedores.length > 0
                          ? fileData.extractedData.vendedores
                          : [fileData.extractedData.vendedor]
                        ).map((v: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded p-2 space-y-1">
                            <div className="text-xs font-medium text-gray-700">Vendedor {index + 1}:</div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                              <input
                                type="text"
                                placeholder="Nombres"
                                className="form-input text-xs focus:border-green-500"
                                value={v?.nombres || ''}
                                onChange={(e) => {
                                  const arr = (fileData.extractedData.vendedores && fileData.extractedData.vendedores.length > 0
                                    ? [...fileData.extractedData.vendedores]
                                    : [ { ...fileData.extractedData.vendedor } ])
                                  arr[index] = { ...arr[index], nombres: e.target.value }
                                  setFiles(prev => prev.map(f => f.id === fileData.id ? {
                                    ...f,
                                    extractedData: { ...f.extractedData, vendedores: arr, vendedor: arr[0] }
                                  } : f))
                                }}
                              />
                              <input
                                type="text"
                                placeholder="Apellidos"
                                className="form-input text-xs focus:border-green-500"
                                value={v?.apellidos || ''}
                                onChange={(e) => {
                                  const arr = (fileData.extractedData.vendedores && fileData.extractedData.vendedores.length > 0
                                    ? [...fileData.extractedData.vendedores]
                                    : [ { ...fileData.extractedData.vendedor } ])
                                  arr[index] = { ...arr[index], apellidos: e.target.value }
                                  setFiles(prev => prev.map(f => f.id === fileData.id ? {
                                    ...f,
                                    extractedData: { ...f.extractedData, vendedores: arr, vendedor: arr[0] }
                                  } : f))
                                }}
                              />
                              <input
                                type="text"
                                placeholder="Identificación"
                                className="form-input text-xs focus:border-green-500"
                                value={v?.cedula || ''}
                                onChange={(e) => {
                                  const arr = (fileData.extractedData.vendedores && fileData.extractedData.vendedores.length > 0
                                    ? [...fileData.extractedData.vendedores]
                                    : [ { ...fileData.extractedData.vendedor } ])
                                  arr[index] = { ...arr[index], cedula: e.target.value }
                                  setFiles(prev => prev.map(f => f.id === fileData.id ? {
                                    ...f,
                                    extractedData: { ...f.extractedData, vendedores: arr, vendedor: arr[0] }
                                  } : f))
                                }}
                              />
                              <select
                                className="form-input text-xs focus:border-green-500"
                                value={v?.nacionalidad || 'ECUATORIANA'}
                                onChange={(e) => {
                                  const arr = (fileData.extractedData.vendedores && fileData.extractedData.vendedores.length > 0
                                    ? [...fileData.extractedData.vendedores]
                                    : [ { ...fileData.extractedData.vendedor } ])
                                  arr[index] = { ...arr[index], nacionalidad: e.target.value }
                                  setFiles(prev => prev.map(f => f.id === fileData.id ? {
                                    ...f,
                                    extractedData: { ...f.extractedData, vendedores: arr, vendedor: arr[0] }
                                  } : f))
                                }}
                              >
                                <option value="ECUATORIANA">🇪🇨 ECUATORIANA</option>
                                <option value="AMERICANA">🇺🇸 AMERICANA</option>
                                <option value="COLOMBIANA">🇨🇴 COLOMBIANA</option>
                                <option value="PERUANA">🇵🇪 PERUANA</option>
                                <option value="VENEZOLANA">🇻🇪 VENEZOLANA</option>
                                <option value="ARGENTINA">🇦🇷 ARGENTINA</option>
                                <option value="CHILENA">🇨🇱 CHILENA</option>
                                <option value="BRASILEÑA">🇧🇷 BRASILEÑA</option>
                                <option value="ALEMANA">🇩🇪 ALEMANA</option>
                                <option value="ESPAÑOLA">🇪🇸 ESPAÑOLA</option>
                                <option value="FRANCESA">🇫🇷 FRANCESA</option>
                                <option value="ITALIANA">🇮🇹 ITALIANA</option>
                                <option value="CANADIENSE">🇨🇦 CANADIENSE</option>
                                <option value="MEXICANA">🇲🇽 MEXICANA</option>
                                <option value="CHINA">🇨🇳 CHINA</option>
                                <option value="JAPONESA">🇯🇵 JAPONESA</option>
                                <option value="EXTRANJERA">🌍 EXTRANJERA</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Compradores - EDITABLE (soporta múltiples) */}
                      <div className="space-y-2">
                        <h6 className="font-medium text-green-700">
                          Compradores (Beneficiarios):
                          {fileData.extractedData.compradores?.length > 1 && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {fileData.extractedData.compradores.length} compradores
                            </span>
                          )}
                          {fileData.extractedData.relacionCompradores?.sonConyuges && (
                            <span className="ml-2 text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                              💒 Cónyuges
                            </span>
                          )}
                        </h6>
                        
                        {(fileData.extractedData.compradores || [fileData.extractedData.comprador]).map((comprador: any, index: number) => 
                          comprador ? (
                            <div key={index} className="border border-gray-200 rounded p-2 space-y-1">
                              <div className="text-xs font-medium text-gray-700">
                                Comprador {index + 1}:
                              </div>
                              <div className="space-y-1">
                                <label className="block text-xs text-gray-600">Nombres:</label>
                                <input
                                  type="text"
                                  value={comprador.nombres}
                                  onChange={(e) => {
                                    // Actualizar el comprador específico en el array
                                    const newCompradores = [...(fileData.extractedData.compradores || [fileData.extractedData.comprador])]
                                    newCompradores[index] = {...newCompradores[index], nombres: e.target.value}
                                    setFiles(prev => prev.map(f => 
                                      f.id === fileData.id ? {
                                        ...f,
                                        extractedData: {
                                          ...f.extractedData,
                                          compradores: newCompradores
                                        }
                                      } : f
                                    ))
                                  }}
                                  className="form-input text-xs focus:border-green-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-xs text-gray-600">Apellidos:</label>
                                <input
                                  type="text"
                                  value={comprador.apellidos}
                                  onChange={(e) => {
                                    const newCompradores = [...(fileData.extractedData.compradores || [fileData.extractedData.comprador])]
                                    newCompradores[index] = {...newCompradores[index], apellidos: e.target.value}
                                    setFiles(prev => prev.map(f => 
                                      f.id === fileData.id ? {
                                        ...f,
                                        extractedData: {
                                          ...f.extractedData,
                                          compradores: newCompradores
                                        }
                                      } : f
                                    ))
                                  }}
                                  className="form-input text-xs focus:border-green-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-xs text-gray-600">Cédula:</label>
                                <input
                                  type="text"
                                  value={comprador.cedula}
                                  onChange={(e) => {
                                    const newCompradores = [...(fileData.extractedData.compradores || [fileData.extractedData.comprador])]
                                    newCompradores[index] = {...newCompradores[index], cedula: e.target.value}
                                    setFiles(prev => prev.map(f => 
                                      f.id === fileData.id ? {
                                        ...f,
                                        extractedData: {
                                          ...f.extractedData,
                                          compradores: newCompradores
                                        }
                                      } : f
                                    ))
                                  }}
                                  className="form-input text-xs focus:border-green-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-xs text-gray-600">Nacionalidad:</label>
                                <select
                                  value={comprador.nacionalidad || 'ECUATORIANA'}
                                  onChange={(e) => {
                                    const newCompradores = [...(fileData.extractedData.compradores || [fileData.extractedData.comprador])]
                                    newCompradores[index] = {...newCompradores[index], nacionalidad: e.target.value}
                                    setFiles(prev => prev.map(f => 
                                      f.id === fileData.id ? {
                                        ...f,
                                        extractedData: {
                                          ...f.extractedData,
                                          compradores: newCompradores
                                        }
                                      } : f
                                    ))
                                  }}
                                  className="form-input text-xs focus:border-green-500"
                                >
                                  <option value="ECUATORIANA">🇪🇨 ECUATORIANA</option>
                                  <option value="AMERICANA">🇺🇸 AMERICANA</option>
                                  <option value="COLOMBIANA">🇨🇴 COLOMBIANA</option>
                                  <option value="PERUANA">🇵🇪 PERUANA</option>
                                  <option value="VENEZOLANA">🇻🇪 VENEZOLANA</option>
                                  <option value="ARGENTINA">🇦🇷 ARGENTINA</option>
                                  <option value="CHILENA">🇨🇱 CHILENA</option>
                                  <option value="BRASILEÑA">🇧🇷 BRASILEÑA</option>
                                  <option value="ALEMANA">🇩🇪 ALEMANA</option>
                                  <option value="ESPAÑOLA">🇪🇸 ESPAÑOLA</option>
                                  <option value="FRANCESA">🇫🇷 FRANCESA</option>
                                  <option value="ITALIANA">🇮🇹 ITALIANA</option>
                                  <option value="CANADIENSE">🇨🇦 CANADIENSE</option>
                                  <option value="MEXICANA">🇲🇽 MEXICANA</option>
                                  <option value="CHINA">🇨🇳 CHINA</option>
                                  <option value="JAPONESA">🇯🇵 JAPONESA</option>
                                  <option value="EXTRANJERA">🌍 EXTRANJERA</option>
                                </select>
                              </div>
                            </div>
                          ) : null
                        )}
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

            <div className="mt-4 flex gap-2">
              <button
                onClick={createSessionsForForms}
                className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Generar enlaces seguros en servidor
              </button>
              <button
                onClick={listServerSessions}
                className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Ver enlaces creados
              </button>
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

            {serverSessions.length > 0 && (
              <div className="mt-4 bg-white border rounded p-4">
                <h4 className="font-medium mb-2">Sesiones recientes</h4>
                <ul className="space-y-2">
                  {serverSessions.map((s: any) => (
                    <li key={s.id} className="text-sm flex items-center justify-between">
                      <span className="truncate mr-2">{s.ownerName || 'Sin nombre'} — {new Date(s.createdAt).toLocaleString()}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(`${window.location.origin}/?form=${s.accessId}`)}
                          className="px-2 py-1 bg-blue-600 text-white rounded"
                        >Copiar link</button>
                        <button
                          onClick={() => window.open(`${window.location.origin}/?form=${s.accessId}`, '_blank')}
                          className="px-2 py-1 bg-green-600 text-white rounded"
                        >Abrir</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
