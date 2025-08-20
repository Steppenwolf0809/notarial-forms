import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ClientQueue from './ClientQueue'
import { generarDatosTramiteSimulados } from '../utils/datosTramiteSimulados'

const SystemDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<'overview' | 'client-queue'>('overview')
  const [demoTramiteData, setDemoTramiteData] = useState<any>(null)

  // Generar datos únicos para el demo al montar el componente
  useEffect(() => {
    const datosUnicos = generarDatosTramiteSimulados()
    setDemoTramiteData({
      id: 'demo-' + Date.now(),
      numeroTramite: `TR-${Date.now().toString().slice(-6)}`,
      extractedData: datosUnicos
    })
  }, [])

  if (currentView === 'client-queue') {
    return (
      <div>
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setCurrentView('overview')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Volver a Demo
          </button>
        </div>
        {demoTramiteData && (
          <ClientQueue 
            tramiteNumber={demoTramiteData.numeroTramite} 
            tramiteData={demoTramiteData}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sistema Notarial Digital - Demo Completo
            </h1>
            <p className="text-gray-600">
              Demostración del flujo completo desde procesamiento hasta captura de datos del cliente
            </p>
          </div>

          {/* Flujo visual */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Subir Documento</h3>
              <p className="text-sm text-gray-600">
                Extracto notarial procesado con OCR
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✏️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Completar Datos</h3>
              <p className="text-sm text-gray-600">
                Operador agrega teléfonos, direcciones, etc.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. QR Estático</h3>
              <p className="text-sm text-gray-600">
                Sistema de cola activado para clientes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">4. Formulario Final</h3>
              <p className="text-sm text-gray-600">
                PDF listo para imprimir y firmar
              </p>
            </div>
          </div>

          {/* Información del trámite de ejemplo */}
          {demoTramiteData && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Trámite de Ejemplo: #{demoTramiteData.numeroTramite}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Información del Acto</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div><strong>Tipo:</strong> {demoTramiteData.extractedData.actoContrato}</div>
                    <div><strong>Valor:</strong> ${parseFloat(demoTramiteData.extractedData.valorContrato).toLocaleString('es-EC')}</div>
                    <div><strong>Estado:</strong> <span className="text-green-600">Listo para envío</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Vendedor</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>{demoTramiteData.extractedData.vendedor.nombres}</div>
                    <div>{demoTramiteData.extractedData.vendedor.apellidos}</div>
                    <div>CI: {demoTramiteData.extractedData.vendedor.cedula}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Comprador</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>{demoTramiteData.extractedData.comprador.nombres}</div>
                    <div>{demoTramiteData.extractedData.comprador.apellidos}</div>
                    <div>CI: {demoTramiteData.extractedData.comprador.cedula}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* URL simulada y QR */}
          {demoTramiteData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium text-blue-900 mb-4">QR Estático Generado</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-blue-700 mb-3">
                    URL del trámite (los clientes acceden con este link):
                  </p>
                  <div className="bg-white p-3 rounded border border-blue-300 text-sm break-all">
                    {window.location.origin}/tramite/{demoTramiteData.numeroTramite}
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/tramite/${demoTramiteData.numeroTramite}`)}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    📋 Copiar URL
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="bg-white p-6 rounded border-2 border-blue-300 inline-block">
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                      <div>
                        <div className="text-lg mb-2">📱</div>
                        <div>QR Code</div>
                        <div>#{demoTramiteData.numeroTramite}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Código QR estático para clientes
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="space-y-4">
            <div className="text-center space-y-3">
              <div>
                <button
                  onClick={() => setCurrentView('client-queue')}
                  className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-lg mr-4"
                >
                  🎯 Probar Vista del Cliente
                </button>
                
                <button
                  onClick={() => {
                    const datosUnicos = generarDatosTramiteSimulados()
                    setDemoTramiteData({
                      id: 'demo-' + Date.now(),
                      numeroTramite: `TR-${Date.now().toString().slice(-6)}`,
                      extractedData: datosUnicos
                    })
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  🔄 Generar Nuevo Trámite
                </button>
              </div>
              
              <p className="text-sm text-gray-500">
                Simula cómo los clientes ven el sistema de cola y llenan sus datos
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Características implementadas:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>✅ Editor de datos complementarios (teléfono, dirección, etc.)</li>
                <li>✅ Sistema de cola con números de trámite</li>
                <li>✅ QR estático para acceso de clientes</li>
                <li>✅ Vista de selección comprador/vendedor</li>
                <li>✅ Formulario UAFE completo para clientes</li>
                <li>✅ Captura de información y validación</li>
                <li>🔄 Integración con generación de PDF (próximo paso)</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SystemDemo
