import React, { useEffect, useState } from 'react'
import { UAFEPersonaNaturalFormSchema } from '@notarial-forms/shared-types'

type Props = { accessId: string }

const API_BASE = '/api/documents'

const ClientFormView: React.FC<Props> = ({ accessId }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cedula, setCedula] = useState('')
  const [authed, setAuthed] = useState(false)
  const [data, setData] = useState<any>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`${API_BASE}/form-session/${accessId}`)
        const json = await res.json()
        if (!json.success) throw new Error(json.error || 'Error')
        setData(json.data?.data || {})
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [accessId])

  const handleLogin = () => {
    if (cedula && cedula.length >= 6) setAuthed(true)
  }



  const updateNested = (path: string, subPath: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [path]: {
        ...prev[path],
        [subPath]: value
      }
    }))
  }

  const updatePersona = (field: string, value: any) => {
    setData((prev: any) => {
      const personas = [...(prev.personas || [{}])]
      personas[0] = { ...personas[0], [field]: value }
      return { ...prev, personas }
    })
  }

  const updatePersonaNested = (field: string, subField: string, value: any) => {
    setData((prev: any) => {
      const personas = [...(prev.personas || [{}])]
      personas[0] = {
        ...personas[0],
        [field]: { ...personas[0]?.[field], [subField]: value }
      }
      return { ...prev, personas }
    })
  }

  const save = async () => {
    setSaving(true)
    try {
      // Validación básica
      UAFEPersonaNaturalFormSchema.parse(data)
      const res = await fetch(`${API_BASE}/form-session/${accessId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Cedula': cedula
        },
        body: JSON.stringify({ data })
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Error al guardar')
      alert('Formulario guardado exitosamente ✅')
    } catch (e: any) {
      alert(`Error: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  const downloadPdf = async () => {
    try {
      const res = await fetch(`${API_BASE}/form-session/${accessId}/pdf`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `formulario_uafe_${accessId}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      alert(`Error al descargar: ${e.message}`)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando formulario…</p>
      </div>
    </div>
  )
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="text-red-500 mb-4">
          <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Reintentar
        </button>
      </div>
    </div>
  )

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Formulario UAFE</h1>
            <p className="text-gray-600">Acceso seguro al formulario</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número de Cédula</label>
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="1234567890"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={20}
              />
              <p className="text-xs text-gray-500 mt-1">Ingrese su número de cédula para acceder al formulario</p>
            </div>
            
            <button 
              onClick={handleLogin} 
              disabled={cedula.length < 6}
              className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FORMULARIO DE DEBIDA DILIGENCIA</h1>
              <p className="text-blue-600 font-semibold mt-1">"CONOZCA A SU USUARIO"</p>
              <p className="text-lg font-medium text-blue-800 mt-2">PERSONAS NATURALES</p>
              <p className="text-gray-600 mt-2 text-sm">
                La Unidad de Análisis Financiero y Económico UAFE, en cumplimiento a las políticas internas de prevención de lavado de activos, requiere la entrega de la siguiente información (favor completar todos los campos obligatoriamente).
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Sesión:</div>
              <div className="text-xs text-gray-400 font-mono">{accessId}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* INFORMACIÓN DEL TRÁMITE */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-white bg-blue-600 px-4 py-2 rounded">INFORMACIÓN DEL TRÁMITE</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha:</label>
                <input 
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data.informacionTramite?.fecha || ''} 
                  onChange={(e) => updateNested('informacionTramite', 'fecha', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Matriz:</label>
                <input 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data.informacionTramite?.numeroMatriz || ''} 
                  onChange={(e) => updateNested('informacionTramite', 'numeroMatriz', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Acto / Contrato Diligencia:</label>
                <input 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data.informacionTramite?.actoContrato || ''} 
                  onChange={(e) => updateNested('informacionTramite', 'actoContrato', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avalúo Municipal:</label>
                <input 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data.informacionTramite?.avaluoMunicipal || ''} 
                  onChange={(e) => updateNested('informacionTramite', 'avaluoMunicipal', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor del Contrato:</label>
                <input 
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data.informacionTramite?.valorContrato || ''} 
                  onChange={(e) => updateNested('informacionTramite', 'valorContrato', e.target.value)} 
                />
              </div>
            </div>
          </section>

          {/* FORMA DE PAGO */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-white bg-blue-600 px-4 py-2 rounded">FORMA DE PAGO</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Cheque */}
              <div className="border border-gray-200 rounded p-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="cheque"
                    checked={data.formaPago?.cheque?.activo || false}
                    onChange={(e) => updateNested('formaPago', 'cheque', { 
                      ...data.formaPago?.cheque, 
                      activo: e.target.checked 
                    })}
                    className="mr-2"
                  />
                  <label htmlFor="cheque" className="font-medium">Cheque:</label>
                </div>
                {data.formaPago?.cheque?.activo && (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600">Monto:</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        value={data.formaPago?.cheque?.monto || ''}
                        onChange={(e) => updateNested('formaPago', 'cheque', {
                          ...data.formaPago?.cheque,
                          monto: parseFloat(e.target.value) || 0
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600">Banco:</label>
                      <input
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        value={data.formaPago?.cheque?.banco || ''}
                        onChange={(e) => updateNested('formaPago', 'cheque', {
                          ...data.formaPago?.cheque,
                          banco: e.target.value
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Efectivo */}
              <div className="border border-gray-200 rounded p-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="efectivo"
                    checked={data.formaPago?.efectivo?.activo || false}
                    onChange={(e) => updateNested('formaPago', 'efectivo', { 
                      ...data.formaPago?.efectivo, 
                      activo: e.target.checked 
                    })}
                    className="mr-2"
                  />
                  <label htmlFor="efectivo" className="font-medium">Efectivo:</label>
                </div>
                {data.formaPago?.efectivo?.activo && (
                  <div>
                    <label className="block text-xs text-gray-600">Monto:</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      value={data.formaPago?.efectivo?.monto || ''}
                      onChange={(e) => updateNested('formaPago', 'efectivo', {
                        ...data.formaPago?.efectivo,
                        monto: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                )}
              </div>

              {/* Transferencia */}
              <div className="border border-gray-200 rounded p-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="transferencia"
                    checked={data.formaPago?.transferencia?.activo || false}
                    onChange={(e) => updateNested('formaPago', 'transferencia', { 
                      ...data.formaPago?.transferencia, 
                      activo: e.target.checked 
                    })}
                    className="mr-2"
                  />
                  <label htmlFor="transferencia" className="font-medium">Transferencia:</label>
                </div>
                {data.formaPago?.transferencia?.activo && (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600">Monto:</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        value={data.formaPago?.transferencia?.monto || ''}
                        onChange={(e) => updateNested('formaPago', 'transferencia', {
                          ...data.formaPago?.transferencia,
                          monto: parseFloat(e.target.value) || 0
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600">Banco:</label>
                      <input
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        value={data.formaPago?.transferencia?.banco || ''}
                        onChange={(e) => updateNested('formaPago', 'transferencia', {
                          ...data.formaPago?.transferencia,
                          banco: e.target.value
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tarjeta */}
              <div className="border border-gray-200 rounded p-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="tarjeta"
                    checked={data.formaPago?.tarjeta?.activo || false}
                    onChange={(e) => updateNested('formaPago', 'tarjeta', { 
                      ...data.formaPago?.tarjeta, 
                      activo: e.target.checked 
                    })}
                    className="mr-2"
                  />
                  <label htmlFor="tarjeta" className="font-medium">Tarjeta:</label>
                </div>
                {data.formaPago?.tarjeta?.activo && (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600">Monto:</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        value={data.formaPago?.tarjeta?.monto || ''}
                        onChange={(e) => updateNested('formaPago', 'tarjeta', {
                          ...data.formaPago?.tarjeta,
                          monto: parseFloat(e.target.value) || 0
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600">Banco:</label>
                      <input
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        value={data.formaPago?.tarjeta?.banco || ''}
                        onChange={(e) => updateNested('formaPago', 'tarjeta', {
                          ...data.formaPago?.tarjeta,
                          banco: e.target.value
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* PERSONAS QUE REALIZAN EL ACTO/CONTRATO */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-white bg-blue-600 px-4 py-2 rounded">PERSONAS QUE REALIZAN EL ACTO/CONTRATO</h2>
            
            {/* Checkboxes para tipo de participación */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>COMPRADOR:</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>VENDEDOR:</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Por sus propios Derechos:</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Representando a:</span>
              </label>
            </div>

            {/* Datos personales principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">APELLIDOS:</label>
                <input 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data?.personas?.[0]?.apellidos || ''} 
                  onChange={(e) => updatePersona('apellidos', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NOMBRES:</label>
                <input 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data?.personas?.[0]?.nombres || ''} 
                  onChange={(e) => updatePersona('nombres', e.target.value)} 
                />
              </div>
            </div>

            {/* Tipo de identificación y otros datos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Identificación:</label>
                <div className="space-y-1">
                  <label className="flex items-center text-sm">
                    <input 
                      type="radio" 
                      name="tipoId" 
                      value="CEDULA"
                      checked={data?.personas?.[0]?.identificacion?.tipo === 'CEDULA'}
                      onChange={(e) => updatePersonaNested('identificacion', 'tipo', e.target.value)}
                      className="mr-2" 
                    />
                    Cédula:
                  </label>
                  <label className="flex items-center text-sm">
                    <input 
                      type="radio" 
                      name="tipoId" 
                      value="RUC"
                      checked={data?.personas?.[0]?.identificacion?.tipo === 'RUC'}
                      onChange={(e) => updatePersonaNested('identificacion', 'tipo', e.target.value)}
                      className="mr-2" 
                    />
                    RUC:
                  </label>
                  <label className="flex items-center text-sm">
                    <input 
                      type="radio" 
                      name="tipoId" 
                      value="PASAPORTE"
                      checked={data?.personas?.[0]?.identificacion?.tipo === 'PASAPORTE'}
                      onChange={(e) => updatePersonaNested('identificacion', 'tipo', e.target.value)}
                      className="mr-2" 
                    />
                    Pasaporte:
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. de Identificación:</label>
                <input 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data?.personas?.[0]?.identificacion?.numero || ''} 
                  onChange={(e) => updatePersonaNested('identificacion', 'numero', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidad:</label>
                <input 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data?.personas?.[0]?.identificacion?.nacionalidad || ''} 
                  onChange={(e) => updatePersonaNested('identificacion', 'nacionalidad', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil:</label>
                <div className="space-y-1 text-sm">
                  {['SOLTERO', 'CASADO', 'VIUDO', 'UNION_LIBRE', 'DIVORCIADO', 'DISOLUCION_SOC_CONYUGAL'].map(estado => (
                    <label key={estado} className="flex items-center">
                      <input 
                        type="radio" 
                        name="estadoCivil" 
                        value={estado}
                        checked={data?.personas?.[0]?.estadoCivil === estado}
                        onChange={(e) => updatePersona('estadoCivil', e.target.value)}
                        className="mr-2" 
                      />
                      {estado.replace('_', ' ').toLowerCase()}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Género y Nivel de Estudio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Género:</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="genero" 
                      value="MASCULINO"
                      checked={data?.personas?.[0]?.genero === 'MASCULINO'}
                      onChange={(e) => updatePersona('genero', e.target.value)}
                      className="mr-2" 
                    />
                    Masculino:
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="genero" 
                      value="FEMENINO"
                      checked={data?.personas?.[0]?.genero === 'FEMENINO'}
                      onChange={(e) => updatePersona('genero', e.target.value)}
                      className="mr-2" 
                    />
                    Femenino:
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Estudio:</label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['BACHILLER', 'UNIVERSITARIO', 'MAESTRIA', 'POST_GRADO'].map(nivel => (
                    <label key={nivel} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={data?.personas?.[0]?.nivelEstudio === nivel}
                        onChange={(e) => updatePersona('nivelEstudio', e.target.checked ? nivel : '')}
                        className="mr-2" 
                      />
                      {nivel.replace('_', ' ').toLowerCase()}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Dirección Domiciliaria */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Dirección Domiciliaria:</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600">Calle Principal:</label>
                  <input 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={data?.personas?.[0]?.direccion?.callePrincipal || ''} 
                    onChange={(e) => updatePersonaNested('direccion', 'callePrincipal', e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Número:</label>
                  <input 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={data?.personas?.[0]?.direccion?.numero || ''} 
                    onChange={(e) => updatePersonaNested('direccion', 'numero', e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Calle Secundaria:</label>
                  <input 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={data?.personas?.[0]?.direccion?.calleSecundaria || ''} 
                    onChange={(e) => updatePersonaNested('direccion', 'calleSecundaria', e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico:</label>
                <input 
                  type="email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data?.personas?.[0]?.contacto?.email || ''} 
                  onChange={(e) => updatePersonaNested('contacto', 'email', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono:</label>
                <input 
                  type="tel"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data?.personas?.[0]?.contacto?.telefono || ''} 
                  onChange={(e) => updatePersonaNested('contacto', 'telefono', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Celular:</label>
                <input 
                  type="tel"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data?.personas?.[0]?.contacto?.celular || ''} 
                  onChange={(e) => updatePersonaNested('contacto', 'celular', e.target.value)} 
                />
              </div>
            </div>
          </section>

          {/* INFORMACIÓN LABORAL PERSONA NATURAL */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-white bg-blue-600 px-4 py-2 rounded">INFORMACIÓN LABORAL PERSONA NATURAL</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Situación Laboral:</label>
                <div className="space-y-1 text-sm">
                  {['PUBLICO', 'PRIVADO', 'JUBILADO', 'NO_APLICA'].map(situacion => (
                    <label key={situacion} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={data?.informacionLaboralTitular?.situacionLaboral === situacion}
                        onChange={(e) => updateNested('informacionLaboralTitular', 'situacionLaboral', e.target.checked ? situacion : '')}
                        className="mr-2" 
                      />
                      {situacion.replace('_', ' ').toLowerCase()}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relación de Dependencia:</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="relacionDependencia" 
                      checked={data?.informacionLaboralTitular?.relacionDependencia === true}
                      onChange={() => updateNested('informacionLaboralTitular', 'relacionDependencia', true)}
                      className="mr-2" 
                    />
                    Sí:
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="relacionDependencia" 
                      checked={data?.informacionLaboralTitular?.relacionDependencia === false}
                      onChange={() => updateNested('informacionLaboralTitular', 'relacionDependencia', false)}
                      className="mr-2" 
                    />
                    NO:
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Entidad:</label>
                <input 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data?.informacionLaboralTitular?.nombreEntidad || ''} 
                  onChange={(e) => updateNested('informacionLaboralTitular', 'nombreEntidad', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso:</label>
                <input 
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data?.informacionLaboralTitular?.fechaIngreso || ''} 
                  onChange={(e) => updateNested('informacionLaboralTitular', 'fechaIngreso', e.target.value)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección:</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  rows={2}
                  value={data?.informacionLaboralTitular?.direccion || ''} 
                  onChange={(e) => updateNested('informacionLaboralTitular', 'direccion', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provincia / Cantón:</label>
                <input 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data?.informacionLaboralTitular?.provinciaCanton || ''} 
                  onChange={(e) => updateNested('informacionLaboralTitular', 'provinciaCanton', e.target.value)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profesión / Ocupación:</label>
                <input 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data?.personas?.[0]?.profesion || ''} 
                  onChange={(e) => updatePersona('profesion', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo:</label>
                <input 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data?.informacionLaboralTitular?.cargo || ''} 
                  onChange={(e) => updateNested('informacionLaboralTitular', 'cargo', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ingreso Mensual:</label>
                <input 
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={data?.informacionLaboralTitular?.ingresoMensual || ''} 
                  onChange={(e) => updateNested('informacionLaboralTitular', 'ingresoMensual', parseFloat(e.target.value) || 0)} 
                />
              </div>
            </div>
          </section>

          {/* DATOS DEL CÓNYUGE - Condicional */}
          {(data?.personas?.[0]?.estadoCivil === 'CASADO' || data.tieneConyuge) && (
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-white bg-blue-600 px-4 py-2 rounded">DATOS DEL CÓNYUGE</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">APELLIDOS:</label>
                  <input 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={data?.conyuge?.apellidos || ''} 
                    onChange={(e) => updateNested('conyuge', 'apellidos', e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NOMBRES:</label>
                  <input 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={data?.conyuge?.nombres || ''} 
                    onChange={(e) => updateNested('conyuge', 'nombres', e.target.value)} 
                  />
                </div>
              </div>

              {/* Resto de campos del cónyuge - similar estructura */}
              <div className="text-sm text-gray-600 italic">
                Complete la información del cónyuge de manera similar a los campos principales...
              </div>
            </section>
          )}

          {/* PEP */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-white bg-blue-600 px-4 py-2 rounded">PERSONAS EXPUESTAS POLÍTICAMENTE (PEP)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded p-4">
                <h4 className="font-medium mb-2">¿SE CONSIDERA UNA PERSONA EXPUESTA POLÍTICAMENTE (PEP)?</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="esPEP" 
                      checked={data?.pep?.esPEP === true}
                      onChange={() => updateNested('pep', 'esPEP', true)}
                      className="mr-2" 
                    />
                    SÍ
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="esPEP" 
                      checked={data?.pep?.esPEP === false}
                      onChange={() => updateNested('pep', 'esPEP', false)}
                      className="mr-2" 
                    />
                    NO
                  </label>
                </div>
              </div>

              <div className="border border-gray-200 rounded p-4">
                <h4 className="font-medium mb-2">¿ES FAMILIAR DE UN "PEP"?</h4>
                <div className="mb-3">
                  <label className="flex items-center mb-1">
                    <input 
                      type="radio" 
                      name="esFamiliarPEP" 
                      checked={data?.pep?.esFamiliarPEP === true}
                      onChange={() => updateNested('pep', 'esFamiliarPEP', true)}
                      className="mr-2" 
                    />
                    SÍ
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="esFamiliarPEP" 
                      checked={data?.pep?.esFamiliarPEP === false}
                      onChange={() => updateNested('pep', 'esFamiliarPEP', false)}
                      className="mr-2" 
                    />
                    NO
                  </label>
                </div>
                
                <div className="text-xs">
                  <div className="mb-2 font-medium">1ro y 2do Grado de Consanguinidad</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {['CONYUGE_O_CONVIVIENTE', 'PADRE_MADRE', 'HIJO_A', 'ABUELO_A', 'HERMANO_A', 'NIETO_A'].map(parentesco => (
                      <label key={parentesco} className="flex items-center">
                        <input type="checkbox" className="mr-1" />
                        {parentesco.replace(/_/g, ' ').toLowerCase()}
                      </label>
                    ))}
                  </div>
                  
                  <div className="mt-2 mb-1 font-medium">1er Grado Afinidad</div>
                  <div className="grid grid-cols-2 gap-1">
                    {['SUEGROS', 'CUNADOS'].map(parentesco => (
                      <label key={parentesco} className="flex items-center">
                        <input type="checkbox" className="mr-1" />
                        {parentesco.toLowerCase()}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded p-4">
                <h4 className="font-medium mb-2">¿ES COLABORADOR DE UN "PEP"?</h4>
                <div className="mb-3">
                  <label className="flex items-center mb-1">
                    <input 
                      type="radio" 
                      name="esColaboradorPEP" 
                      checked={data?.pep?.esColaboradorPEP === true}
                      onChange={() => updateNested('pep', 'esColaboradorPEP', true)}
                      className="mr-2" 
                    />
                    SÍ
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="esColaboradorPEP" 
                      checked={data?.pep?.esColaboradorPEP === false}
                      onChange={() => updateNested('pep', 'esColaboradorPEP', false)}
                      className="mr-2" 
                    />
                    NO
                  </label>
                </div>
                
                <div className="text-xs space-y-1">
                  {['ASISTENTE', 'ASESOR', 'PERSONA_CONFIANZA'].map(rol => (
                    <label key={rol} className="flex items-center">
                      <input type="checkbox" className="mr-1" />
                      {rol.replace(/_/g, ' ').toLowerCase()}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Firma */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <div className="border-t border-gray-300 pt-6">
              <div className="text-center">
                <div className="border-b border-gray-400 w-80 mx-auto mb-2"></div>
                <p className="text-sm font-medium">Firma del Usuario</p>
                <p className="text-xs text-gray-600 mt-1">Nombre:</p>
              </div>
            </div>
          </section>
        </div>

        {/* Botones de acción */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={save} 
              disabled={saving}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar Formulario
                </>
              )}
            </button>
            <button 
              onClick={downloadPdf} 
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors flex items-center justify-center"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar Formulario
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Los campos son obligatorios según el formulario UAFE oficial. 
              El formulario se guarda automáticamente al hacer clic en "Guardar Formulario".
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientFormView