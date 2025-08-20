// Generador de datos simulados únicos para cada trámite
// para evitar la reutilización de datos como "Verónica"

interface DatosPersonaSimulados {
  nombres: string
  apellidos: string
  cedula: string
  nacionalidad: string
  calidad: string
  tipoInterviniente: string
}

interface DatosTramiteSimulados {
  escritura: string
  fechaOtorgamiento: string
  actoContrato: string
  valorContrato: string
  vendedor: DatosPersonaSimulados
  comprador: DatosPersonaSimulados
  ubicacion: {
    provincia: string
    canton: string
    parroquia: string
  }
  notaria: {
    nombre: string
    numero: string
  }
  tipo: string
}

// Base de nombres y apellidos ecuatorianos realistas
const NOMBRES_MASCULINOS = [
  'CARLOS MANUEL', 'JORGE EDUARDO', 'LUIS FERNANDO', 'MIGUEL ANGEL', 
  'JUAN CARLOS', 'DIEGO ALBERTO', 'FERNANDO JOSE', 'RICARDO ANDRES',
  'PABLO SEBASTIAN', 'ANDRES FELIPE', 'DANIEL ALEJANDRO', 'MARIO VICENTE'
]

const NOMBRES_FEMENINOS = [
  'MARIA ELENA', 'ANA LUCIA', 'PATRICIA INES', 'SOFIA GABRIELA',
  'CARMEN ROSA', 'LUCIA FERNANDA', 'ELENA PATRICIA', 'ROSA MARIA',
  'GABRIELA SUSANA', 'INES DOLORES', 'FERNANDA TERESA', 'SUSANA BEATRIZ'
]

const APELLIDOS = [
  'GARCIA LOPEZ', 'MARTINEZ SILVA', 'RODRIGUEZ TORRES', 'PEREZ GONZALEZ',
  'SANCHEZ HERRERA', 'RAMIREZ CASTRO', 'CRUZ MORALES', 'FLORES JIMENEZ',
  'GUTIERREZ VARGAS', 'MENDOZA ORTIZ', 'CHAVEZ RUIZ', 'MORENO DIAZ',
  'JIMENEZ RAMOS', 'HERRERA AGUILAR', 'MEDINA ROMERO', 'CASTRO GUERRERO',
  'ORTEGA MENDEZ', 'RUIZ DELGADO', 'VARGAS ESPINOZA', 'DELGADO VEGA'
]

const PROVINCIAS = [
  { nombre: 'PICHINCHA', cantones: ['QUITO', 'MEJIA', 'RUMIÑAHUI'] },
  { nombre: 'GUAYAS', cantones: ['GUAYAQUIL', 'DURAN', 'SAMBORONDON'] },
  { nombre: 'AZUAY', cantones: ['CUENCA', 'GIRON', 'GUALACEO'] },
  { nombre: 'TUNGURAHUA', cantones: ['AMBATO', 'BAÑOS', 'PELILEO'] },
  { nombre: 'IMBABURA', cantones: ['IBARRA', 'OTAVALO', 'COTACACHI'] }
]

const PARROQUIAS = [
  'IÑAQUITO', 'LA MARISCAL', 'BELISARIO QUEVEDO', 'LA MAGDALENA',
  'SAN JUAN', 'CENTRO HISTORICO', 'LA FLORESTA', 'GONZALEZ SUAREZ',
  'LA CAROLINA', 'EL BATAAN', 'PONCEANO', 'COCHAPAMBA'
]

const NOTARIOS = [
  'GLENDA ELIZABETH ZAPATA SILVA', 'MARIA FERNANDA TORRES LEON',
  'CARLOS EDUARDO MARTINEZ RUIZ', 'ANA LUCIA HERRERA CASTRO',
  'DIEGO ALBERTO SANCHEZ MORA', 'PATRICIA INES RODRIGUEZ VEGA',
  'FERNANDO JOSE GARCIA ORTEGA', 'LUCIA FERNANDA CHAVEZ DIAZ'
]

const TIPOS_ACTO = [
  'COMPRAVENTA', 'DONACION', 'PERMUTA', 'CONSTITUCION DE SOCIEDAD',
  'FIDEICOMISO', 'CESION DE DERECHOS', 'HIPOTECA'
]

/**
 * Genera una cédula ecuatoriana válida (formato simulado)
 */
const generarCedulaSimulada = (): string => {
  // Generar primeros 2 dígitos (provincia: 01-24)
  const provincia = String(Math.floor(Math.random() * 24) + 1).padStart(2, '0')
  
  // Generar 6 dígitos del número secuencial
  const secuencial = String(Math.floor(Math.random() * 999999)).padStart(6, '0')
  
  // Generar 2 dígitos finales
  const finales = String(Math.floor(Math.random() * 99)).padStart(2, '0')
  
  return `${provincia}${secuencial}${finales}`
}

/**
 * Genera un número de escritura realista
 */
const generarNumeroEscritura = (): string => {
  const año = new Date().getFullYear()
  const secuencial = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0')
  const codigo = `${año}${Math.floor(Math.random() * 100)}`
  return `${codigo}P${secuencial}`
}

/**
 * Genera una fecha reciente en formato notarial
 */
const generarFechaOtorgamiento = (): string => {
  const hoy = new Date()
  const diasAtras = Math.floor(Math.random() * 90) // Últimos 90 días
  const fecha = new Date(hoy.getTime() - (diasAtras * 24 * 60 * 60 * 1000))
  
  const meses = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ]
  
  const dia = fecha.getDate()
  const mes = meses[fecha.getMonth()]
  const año = fecha.getFullYear()
  
  return `${dia} DE ${mes} DEL ${año}`
}

/**
 * Selecciona un elemento aleatorio de un array
 */
const seleccionarAleatorio = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Genera datos simulados únicos para un nuevo trámite
 */
export const generarDatosTramiteSimulados = (): DatosTramiteSimulados => {
  // Seleccionar ubicación
  const provincia = seleccionarAleatorio(PROVINCIAS)
  const canton = seleccionarAleatorio(provincia.cantones)
  const parroquia = seleccionarAleatorio(PARROQUIAS)
  
  // Generar datos del vendedor
  const esVendedorMasculino = Math.random() > 0.5
  const vendedor: DatosPersonaSimulados = {
    nombres: seleccionarAleatorio(esVendedorMasculino ? NOMBRES_MASCULINOS : NOMBRES_FEMENINOS),
    apellidos: seleccionarAleatorio(APELLIDOS),
    cedula: generarCedulaSimulada(),
    nacionalidad: 'ECUATORIANA',
    calidad: 'VENDEDOR',
    tipoInterviniente: 'POR SUS PROPIOS DERECHOS'
  }
  
  // Generar datos del comprador
  const esCompradorMasculino = Math.random() > 0.5
  const comprador: DatosPersonaSimulados = {
    nombres: seleccionarAleatorio(esCompradorMasculino ? NOMBRES_MASCULINOS : NOMBRES_FEMENINOS),
    apellidos: seleccionarAleatorio(APELLIDOS),
    cedula: generarCedulaSimulada(),
    nacionalidad: 'ECUATORIANA',
    calidad: 'COMPRADOR',
    tipoInterviniente: 'POR SUS PROPIOS DERECHOS'
  }
  
  // Generar valor del contrato realista (entre $50,000 y $500,000)
  const valorMinimo = 50000
  const valorMaximo = 500000
  const valor = Math.floor(Math.random() * (valorMaximo - valorMinimo) + valorMinimo)
  
  return {
    escritura: generarNumeroEscritura(),
    fechaOtorgamiento: generarFechaOtorgamiento(),
    actoContrato: seleccionarAleatorio(TIPOS_ACTO),
    valorContrato: valor.toFixed(2),
    vendedor,
    comprador,
    ubicacion: {
      provincia: provincia.nombre,
      canton,
      parroquia
    },
    notaria: {
      nombre: seleccionarAleatorio(NOTARIOS),
      numero: `NOTARÍA ${seleccionarAleatorio(['PRIMERA', 'SEGUNDA', 'TERCERA', 'CUARTA', 'QUINTA', 'SEXTA', 'SÉPTIMA', 'OCTAVA', 'NOVENA', 'DÉCIMA'])} DEL CANTÓN ${canton}`
    },
    tipo: 'Extracto Notarial'
  }
}

/**
 * Genera datos de personas adicionales para casos especiales
 */
export const generarPersonaAdicional = (calidad: string = 'INTERVINIENTE'): DatosPersonaSimulados => {
  const esMasculino = Math.random() > 0.5
  
  return {
    nombres: seleccionarAleatorio(esMasculino ? NOMBRES_MASCULINOS : NOMBRES_FEMENINOS),
    apellidos: seleccionarAleatorio(APELLIDOS),
    cedula: generarCedulaSimulada(),
    nacionalidad: Math.random() > 0.9 ? 'EXTRANJERA' : 'ECUATORIANA',
    calidad,
    tipoInterviniente: 'POR SUS PROPIOS DERECHOS'
  }
}

/**
 * Valida que dos trámites tengan datos diferentes (para testing)
 */
export const validarDatosUnicos = (tramite1: DatosTramiteSimulados, tramite2: DatosTramiteSimulados): boolean => {
  return (
    tramite1.escritura !== tramite2.escritura &&
    tramite1.vendedor.cedula !== tramite2.vendedor.cedula &&
    tramite1.comprador.cedula !== tramite2.comprador.cedula &&
    tramite1.vendedor.nombres !== tramite2.vendedor.nombres &&
    tramite1.comprador.nombres !== tramite2.comprador.nombres
  )
}
