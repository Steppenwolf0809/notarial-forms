import React, { useEffect, useState } from 'react'

interface Persona {
  id: string
  tipo: 'VENDEDOR' | 'COMPRADOR'
  nombres: string
  apellidos: string
  status: string
}

interface Tramite {
  id: string
  actoContrato: string
  valorContrato: string
  fechaOtorgamiento: string
  personas: Persona[]
  createdAt: string
}

const TramitesQueue: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [tramites, setTramites] = useState<Tramite[]>([])
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [cedula, setCedula] = useState('')
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTramites()
  }, [])

  const fetchTramites = async () => {
    try {
      const res = await fetch('/api/tramites/pending')
      const json = await res.json()
      if (json.success) {
        setTramites(json.data)
      } else {
        setError('Error al cargar trámites')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPersona = (persona: Persona) => {
    setSelectedPersona(persona)
    setCedula('')
    setError(null)
  }

  const handleValidateAndAccess = async () => {
    if (!selectedPersona || !cedula) return
    
    setValidating(true)
    setError(null)
    
    try {
      const res = await fetch('/api/tramites/validate-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaId: selectedPersona.id,
          cedula: cedula.trim()
        })
      })
      
      const json = await res.json()
      console.log('🔐 Respuesta de validación:', json)
      
      if (json.success) {
        // Redirect to form with the accessId
        console.log('✅ Redirigiendo a formulario:', `/?form=${json.data.accessId}`)
        window.location.href = `/?form=${json.data.accessId}`
      } else {
        console.log('❌ Error de validación:', json.error)
        if (json.error === 'INVALID_CEDULA') {
          setError('Número de cédula incorrecto. Verifique e intente nuevamente.')
        } else {
          setError('Error de validación. Intente nuevamente.')
        }
      }
    } catch (err) {
      console.error('❌ Error de conexión:', err)
      setError('Error de conexión. Intente nuevamente.')
    } finally {
      setValidating(false)
    }
  }

  const formatCurrency = (value: string) => {
    const num = parseFloat(value) || 0
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(num)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando trámites disponibles...</p>
        </div>
      </div>
    )
  }

  if (selectedPersona) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Verificación de Identidad</h1>
              <p className="text-gray-600 text-sm">
                Confirme su identidad para acceder al formulario
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-1">
                {selectedPersona.nombres} {selectedPersona.apellidos}
              </h3>
              <p className="text-blue-700 text-sm">
                Rol: {selectedPersona.tipo === 'VENDEDOR' ? 'Vendedor' : 'Comprador'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Cédula
                </label>
                <input
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  placeholder="1234567890"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={20}
                />
                {error && (
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedPersona(null)}
                  className="flex-1 bg-gray-300 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleValidateAndAccess}
                  disabled={validating || cedula.length < 6}
                  className="flex-1 bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                  {validating ? 'Verificando...' : 'Acceder al Formulario'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trámites Notariales Pendientes
          </h1>
          <p className="text-gray-600">
            Seleccione su nombre para completar el formulario UAFE
          </p>
        </div>

        {tramites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay trámites pendientes
            </h3>
            <p className="text-gray-600">
              Por el momento no hay formularios UAFE disponibles para completar.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {tramites.map((tramite) => (
              <div key={tramite.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {tramite.actoContrato}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Valor: {formatCurrency(tramite.valorContrato)}
                      </p>
                      {tramite.fechaOtorgamiento && (
                        <p className="text-gray-500 text-xs mt-1">
                          Fecha: {tramite.fechaOtorgamiento}
                        </p>
                      )}
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Pendiente
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">
                    Seleccione su nombre para continuar:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tramite.personas.map((persona) => (
                      <button
                        key={persona.id}
                        onClick={() => handleSelectPersona(persona)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900 group-hover:text-blue-900">
                              {persona.nombres} {persona.apellidos}
                            </h5>
                            <p className="text-sm text-gray-600 group-hover:text-blue-700">
                              {persona.tipo === 'VENDEDOR' ? '👤 Vendedor' : '🏠 Comprador'}
                            </p>
                          </div>
                          <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            ¿No ve su nombre en la lista? Contacte con la notaría para verificar el estado de su trámite.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TramitesQueue
