import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ClientQueue from './ClientQueue'

interface TramiteQueueItem {
  id: string
  numeroTramite: string
  actoContrato: string
  valorContrato: string
  fechaCreacion: Date
  status: 'activo' | 'en-proceso' | 'completado'
  participantes: {
    vendedor: {
      nombres: string
      apellidos: string
      cedula: string
      completado: boolean
    }
    comprador: {
      nombres: string
      apellidos: string
      cedula: string
      completado: boolean
    }
  }
  extractedData?: any
}

interface TramiteQueueProps {
  // Props opcionales para datos iniciales
  initialTramites?: TramiteQueueItem[]
}

const TramiteQueue: React.FC<TramiteQueueProps> = ({ initialTramites = [] }) => {
  const [tramites, setTramites] = useState<TramiteQueueItem[]>([])
  const [selectedTramite, setSelectedTramite] = useState<string | null>(null)
  const [showClientForm, setShowClientForm] = useState(false)
  const [filter, setFilter] = useState<'todos' | 'activo' | 'completado'>('activo')
  
  // Estados para autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authCedula, setAuthCedula] = useState('')
  const [authError, setAuthError] = useState('')
  const [userTramites, setUserTramites] = useState<TramiteQueueItem[]>([])

  // Simular datos de trámites activos (en producción vendría del backend)
  useEffect(() => {
    // Si hay trámites iniciales, usarlos
    if (initialTramites.length > 0) {
      setTramites(initialTramites)
      return
    }

    // Datos simulados para demostración
    const tramitesSimulados: TramiteQueueItem[] = [
      {
        id: '1',
        numeroTramite: 'TR-789012',
        actoContrato: 'COMPRAVENTA DE INMUEBLE',
        valorContrato: '185000.00',
        fechaCreacion: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        status: 'activo',
        participantes: {
          vendedor: {
            nombres: 'MARÍA JOSÉ',
            apellidos: 'GONZÁLEZ PÉREZ',
            cedula: '1234567890',
            completado: false
          },
          comprador: {
            nombres: 'CARLOS ANDRÉS',
            apellidos: 'RODRÍGUEZ SANTOS',
            cedula: '0987654321',
            completado: false
          }
        }
      },
      {
        id: '2',
        numeroTramite: 'TR-345678',
        actoContrato: 'COMPRAVENTA DE VEHÍCULO',
        valorContrato: '25000.00',
        fechaCreacion: new Date(Date.now() - 45 * 60 * 1000), // 45 minutos atrás
        status: 'en-proceso',
        participantes: {
          vendedor: {
            nombres: 'JOSÉ LUIS',
            apellidos: 'MARTÍNEZ LÓPEZ',
            cedula: '1122334455',
            completado: true
          },
          comprador: {
            nombres: 'ANA CAROLINA',
            apellidos: 'VÁSQUEZ MORENO',
            cedula: '5566778899',
            completado: false
          }
        }
      },
      {
        id: '3',
        numeroTramite: 'TR-567890',
        actoContrato: 'CONSTITUCIÓN DE HIPOTECA',
        valorContrato: '95000.00',
        fechaCreacion: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
        status: 'activo',
        participantes: {
          vendedor: {
            nombres: 'ROBERTO CARLOS',
            apellidos: 'JIMÉNEZ TORRES',
            cedula: '2233445566',
            completado: false
          },
          comprador: {
            nombres: 'LILIANA PATRICIA',
            apellidos: 'HERRERA GÓMEZ',
            cedula: '6677889900',
            completado: false
          }
        }
      }
    ]

    setTramites(tramitesSimulados)
  }, [initialTramites])

  // Función para autenticar con cédula
  const handleAuthentication = (cedula: string) => {
    setAuthError('')
    
    // Validar formato de cédula ecuatoriana (10 dígitos)
    if (!/^\d{10}$/.test(cedula)) {
      setAuthError('La cédula debe tener 10 dígitos')
      return
    }
    
    // Buscar trámites donde la persona aparezca como vendedor o comprador
    const tramitesDelUsuario = tramites.filter(tramite => 
      tramite.participantes.vendedor.cedula === cedula || 
      tramite.participantes.comprador.cedula === cedula
    )
    
    if (tramitesDelUsuario.length === 0) {
      setAuthError('No se encontraron trámites asociados a esta cédula')
      return
    }
    
    // Autenticación exitosa
    setUserTramites(tramitesDelUsuario)
    setIsAuthenticated(true)
    setAuthCedula(cedula)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAuthCedula('')
    setUserTramites([])
    setAuthError('')
    setSelectedTramite(null)
    setShowClientForm(false)
  }

  const tramitesFiltrados = (isAuthenticated ? userTramites : tramites).filter(tramite => {
    if (filter === 'todos') return true
    if (filter === 'activo') return tramite.status === 'activo'
    if (filter === 'completado') return tramite.status === 'completado'
    return true
  })

  const handleTramiteSelect = (tramiteId: string) => {
    setSelectedTramite(tramiteId)
    setShowClientForm(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-800 border-green-200'
      case 'en-proceso': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completado': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getParticipacionColor = (completado: boolean) => {
    return completado 
      ? 'bg-green-50 border-green-200 text-green-800' 
      : 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }

  const formatTimeAgo = (fecha: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - fecha.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffMins < 60) {
      return `hace ${diffMins} min${diffMins !== 1 ? 's' : ''}`
    }
    return `hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`
  }

  // Pantalla de autenticación
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full p-8"
        >
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Seguro</h1>
            <p className="text-gray-600">Ingrese su número de cédula para acceder a sus trámites</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault()
            handleAuthentication(authCedula)
          }} className="space-y-6">
            <div>
              <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-2">
                Número de Cédula
              </label>
              <input
                type="text"
                id="cedula"
                value={authCedula}
                onChange={(e) => {
                  setAuthCedula(e.target.value.replace(/\D/g, '')) // Solo números
                  setAuthError('')
                }}
                maxLength={10}
                placeholder="1234567890"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                required
              />
              {authError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-2 text-center"
                >
                  {authError}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={authCedula.length !== 10}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Acceder a Mis Trámites
            </button>
          </form>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Seguridad</h4>
                <p className="text-xs text-gray-600">
                  Solo podrá ver los trámites asociados a su cédula. Sus datos están protegidos.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (showClientForm && selectedTramite) {
    const tramite = userTramites.find(t => t.id === selectedTramite)
    if (tramite) {
      return (
        <ClientQueue
          tramiteNumber={tramite.numeroTramite}
          tramiteData={{
            id: tramite.id,
            numeroTramite: tramite.numeroTramite,
            extractedData: tramite.extractedData || {
              actoContrato: tramite.actoContrato,
              valorContrato: tramite.valorContrato,
              vendedor: tramite.participantes.vendedor,
              comprador: tramite.participantes.comprador
            }
          }}
        />
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Trámites Notariales</h1>
                <p className="text-gray-600">Cédula: {authCedula} • {userTramites.length} trámite{userTramites.length !== 1 ? 's' : ''} disponible{userTramites.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right mr-4">
                <div className="text-sm text-gray-500">Trámites activos</div>
                <div className="text-2xl font-bold text-blue-600">
                  {userTramites.filter(t => t.status === 'activo').length}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6"
        >
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filtrar por estado:</span>
            {[
              { key: 'activo', label: 'Activos', count: tramites.filter(t => t.status === 'activo').length },
              { key: 'en-proceso', label: 'En Proceso', count: tramites.filter(t => t.status === 'en-proceso').length },
              { key: 'todos', label: 'Todos', count: tramites.length }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Lista de Trámites */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {tramitesFiltrados.map((tramite) => (
              <motion.div
                key={tramite.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer"
                onClick={() => handleTramiteSelect(tramite.id)}
              >
                {/* Header del trámite */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">#{tramite.numeroTramite}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(tramite.status)}`}>
                      {tramite.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{tramite.actoContrato}</p>
                  <p className="text-lg font-bold text-green-600">${tramite.valorContrato}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(tramite.fechaCreacion)}</p>
                </div>

                {/* Participantes */}
                <div className="p-4 space-y-3">
                  {/* Vendedor */}
                  <div className={`p-3 rounded-lg border ${getParticipacionColor(tramite.participantes.vendedor.completado)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">VENDEDOR</span>
                      {tramite.participantes.vendedor.completado ? (
                        <span className="text-green-600">✅</span>
                      ) : (
                        <span className="text-yellow-600">⏳</span>
                      )}
                    </div>
                    <div className="text-sm font-medium">
                      {tramite.participantes.vendedor.nombres} {tramite.participantes.vendedor.apellidos}
                    </div>
                    <div className="text-xs text-gray-600">CI: {tramite.participantes.vendedor.cedula}</div>
                  </div>

                  {/* Comprador */}
                  <div className={`p-3 rounded-lg border ${getParticipacionColor(tramite.participantes.comprador.completado)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">COMPRADOR</span>
                      {tramite.participantes.comprador.completado ? (
                        <span className="text-green-600">✅</span>
                      ) : (
                        <span className="text-yellow-600">⏳</span>
                      )}
                    </div>
                    <div className="text-sm font-medium">
                      {tramite.participantes.comprador.nombres} {tramite.participantes.comprador.apellidos}
                    </div>
                    <div className="text-xs text-gray-600">CI: {tramite.participantes.comprador.cedula}</div>
                  </div>
                </div>

                {/* Call to action */}
                <div className="p-4 bg-gray-50 border-t">
                  <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                    Acceder al Trámite
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Estado vacío */}
        {tramitesFiltrados.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
          >
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay trámites {filter !== 'todos' ? filter + 's' : ''}</h3>
            <p className="text-gray-500">
              {filter === 'activo' 
                ? 'No hay trámites activos en este momento'
                : 'No hay trámites que coincidan con el filtro seleccionado'
              }
            </p>
          </motion.div>
        )}

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-xl border border-blue-200 p-6 mt-6"
        >
          <div className="flex items-start space-x-3">
            <div className="text-blue-600 mt-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Instrucciones</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Busque su trámite en la lista usando su nombre o número de cédula</li>
                <li>• Haga clic en el trámite correspondiente para acceder al formulario</li>
                <li>• Complete toda la información solicitada</li>
                <li>• El estado cambiará automáticamente cuando termine</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TramiteQueue
