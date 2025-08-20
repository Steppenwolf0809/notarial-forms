import { useState } from 'react'
import { motion } from 'framer-motion'
import DocumentUpload from './components/DocumentUploadStub'
import SystemDemo from './components/SystemDemo'
import TramiteQueue from './components/TramiteQueue'

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'process' | 'results' | 'demo' | 'queue'>('upload')
  const [extractedData, setExtractedData] = useState<any>(null)
  const [generatedForms, setGeneratedForms] = useState<any[]>([])

  const handleFileSelect = (files: File[]) => {
    console.log('Archivos seleccionados:', files)
  }

  const handleUploadComplete = (fileId: string, result: any) => {
    console.log('Subida completada:', fileId, result)
  }

  const handleProcessingComplete = (fileId: string, extractedData: any) => {
    console.log('Procesamiento completado:', fileId, extractedData)
    if (fileId === 'forms-generated') {
      // Cuando se generan formularios
      setGeneratedForms([extractedData.compradorForm, extractedData.vendedorForm])
      setActiveTab('results')
    } else {
      // Cuando se procesa un documento
      setExtractedData(extractedData)
    }
  }

  const handleError = (error: Error, fileId?: string) => {
    console.error('Error:', error, fileId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-notarial-50 via-white to-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="bg-primary-600 p-2 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema Notarial</h1>
                <p className="text-sm text-gray-500">Procesamiento de Documentos</p>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Ecuador</span>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-600">Notaría Digital</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'upload', label: 'Subir Documentos', icon: 'upload' },
              { id: 'process', label: 'Procesar', icon: 'cog' },
              { id: 'results', label: 'Resultados', icon: 'document-text' },
              { id: 'queue', label: 'Cola de Clientes', icon: 'users' },
              { id: 'demo', label: 'Demo Completo', icon: 'eye' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TabIcon icon={tab.icon} />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Subir Documentos Notariales
                </h2>
                <p className="text-gray-600 mb-6">
                  Arrastra y suelta o selecciona documentos PDF, imágenes o capturas de pantalla 
                  de formularios notariales ecuatorianos para procesar.
                </p>
                
                <DocumentUpload
                  config={{
                    maxFileSize: 50 * 1024 * 1024, // 50MB
                    maxFiles: 10,
                    acceptedTypes: ['image/*', 'application/pdf'],
                    allowMultiple: true,
                    autoUpload: false,
                    enableClipboard: true
                  }}
                  onFileSelect={handleFileSelect}
                  onUploadComplete={handleUploadComplete}
                  onProcessingComplete={handleProcessingComplete}
                  onError={handleError}
                />
              </div>
              
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-3">
                  Tipos de Documentos Soportados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-800">Formularios de Vehículos:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Matriculación de vehículos</li>
                      <li>• Transferencias de dominio</li>
                      <li>• Cambios de propietario</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-800">Artículo 29:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Extractos notariales</li>
                      <li>• Certificaciones</li>
                      <li>• Documentos de identidad</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'process' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Procesamiento de Documentos
              </h2>
              <p className="text-gray-600">
                Los documentos se procesan automáticamente después de la subida. 
                Aquí podrás ver el estado del procesamiento OCR y la extracción de datos.
              </p>
            </div>
          )}
          
          {activeTab === 'queue' && (
            <TramiteQueue />
          )}
          
          {activeTab === 'demo' && (
            <SystemDemo />
          )}
          
          {activeTab === 'results' && (
            <div className="space-y-6">
              {/* Datos extraídos */}
              {extractedData && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Datos Extraídos del Extracto Notarial
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información del Acto */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-800">Información del Acto:</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Escritura:</strong> {extractedData.escritura}</div>
                        <div><strong>Fecha:</strong> {extractedData.fechaOtorgamiento}</div>
                        <div><strong>Acto:</strong> {extractedData.actoContrato}</div>
                        <div><strong>Valor:</strong> ${extractedData.valorContrato}</div>
                      </div>
                    </div>

                    {/* Información del Inmueble */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-800">Ubicación del Inmueble:</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Provincia:</strong> {extractedData.ubicacion.provincia}</div>
                        <div><strong>Cantón:</strong> {extractedData.ubicacion.canton}</div>
                        <div><strong>Parroquia:</strong> {extractedData.ubicacion.parroquia}</div>
                      </div>
                    </div>

                    {/* Vendedor */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-800">Vendedor (Otorgante):</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Nombres:</strong> {extractedData.vendedor.nombres}</div>
                        <div><strong>Apellidos:</strong> {extractedData.vendedor.apellidos}</div>
                        <div><strong>Cédula:</strong> {extractedData.vendedor.cedula}</div>
                        <div><strong>Nacionalidad:</strong> {extractedData.vendedor.nacionalidad}</div>
                        <div><strong>Calidad:</strong> {extractedData.vendedor.calidad}</div>
                      </div>
                    </div>

                    {/* Comprador */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-800">Comprador (Beneficiario):</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Nombres:</strong> {extractedData.comprador.nombres}</div>
                        <div><strong>Apellidos:</strong> {extractedData.comprador.apellidos}</div>
                        <div><strong>Cédula:</strong> {extractedData.comprador.cedula}</div>
                        <div><strong>Nacionalidad:</strong> {extractedData.comprador.nacionalidad}</div>
                        <div><strong>Calidad:</strong> {extractedData.comprador.calidad}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Formularios generados */}
              {generatedForms.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Formularios UAFE Generados ({generatedForms.length})
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedForms.map((form) => (
                      <div key={form.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
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
                            Generado
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div><strong>Acto:</strong> {form.acto.actoContrato}</div>
                          <div><strong>Valor:</strong> ${form.acto.valorContrato}</div>
                          <div><strong>Link:</strong></div>
                          <div className="bg-white p-2 rounded border text-blue-600 break-all">
                            {form.link}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Estado:</h4>
                    <p className="text-sm text-yellow-700">
                      Los formularios han sido generados exitosamente. Los links están listos para enviar a los clientes.
                    </p>
                  </div>
                </div>
              )}

              {/* Estado inicial cuando no hay datos */}
              {!extractedData && generatedForms.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Resultados de Extracción
                  </h2>
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 mb-2">No hay datos procesados aún</p>
                    <p className="text-sm text-gray-400">
                      Sube un extracto notarial en la pestaña "Subir Documentos" para ver los resultados aquí.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}

function TabIcon({ icon }: { icon: string }) {
  const iconMap = {
    upload: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    cog: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    'document-text': (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    users: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    eye: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  }
  
  return iconMap[icon as keyof typeof iconMap] || null
}

export default App