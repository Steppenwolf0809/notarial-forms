import { z } from 'zod'

// Enumeraciones básicas alineadas con los formularios impresos
export const GeneroSchema = z.enum(['MASCULINO', 'FEMENINO', 'OTRO']).optional()

export const EstadoCivilSchema = z.enum([
  'SOLTERO',
  'CASADO',
  'DIVORCIADO',
  'VIUDO',
  'UNION_LIBRE',
  'DISOLUCION_SOC_CONYUGAL'
]).optional()

export const NivelEstudioSchema = z.enum([
  'BACHILLER',
  'UNIVERSITARIO',
  'MAESTRIA',
  'POST_GRADO',
  'OTRO'
]).optional()

export const TipoIdentificacionSchema = z.enum(['CEDULA', 'RUC', 'PASAPORTE']).optional()

// Sub-esquemas reutilizables
export const DireccionSchema = z.object({
  callePrincipal: z.string().max(120).optional(),
  calleSecundaria: z.string().max(120).optional(),
  numero: z.string().max(20).optional(),
  provincia: z.string().max(60).optional(),
  canton: z.string().max(60).optional(),
  parroquia: z.string().max(60).optional()
}).optional()

export const ContactoSchema = z.object({
  email: z.string().email().optional(),
  telefono: z.string().max(30).optional(),
  celular: z.string().max(30).optional()
}).optional()

export const IdentificacionSchema = z.object({
  tipo: TipoIdentificacionSchema,
  numero: z.string().max(20).optional(),
  nacionalidad: z.string().max(60).optional()
}).optional()

export const PersonaBasicaSchema = z.object({
  apellidos: z.string().max(120).optional(),
  nombres: z.string().max(120).optional(),
  genero: GeneroSchema,
  estadoCivil: EstadoCivilSchema,
  nivelEstudio: NivelEstudioSchema,
  identificacion: IdentificacionSchema,
  profesion: z.string().max(120).optional(),
  ocupacion: z.string().max(120).optional(),
  direccion: DireccionSchema,
  contacto: ContactoSchema
})

export const InformacionLaboralSchema = z.object({
  situacionLaboral: z.enum(['PUBLICO', 'PRIVADO', 'JUBILADO', 'NO_APLICA']).optional(),
  relacionDependencia: z.boolean().optional(),
  nombreEntidad: z.string().max(150).optional(),
  fechaIngreso: z.string().optional(),
  direccion: z.string().max(200).optional(),
  provinciaCanton: z.string().max(120).optional(),
  cargo: z.string().max(120).optional(),
  ingresoMensual: z.number().nonnegative().optional()
}).optional()

export const PEPRelacionSchema = z.object({
  esPEP: z.boolean().optional(),
  esFamiliarPEP: z.boolean().optional(),
  esColaboradorPEP: z.boolean().optional(),
  parentescosConsanguinidad: z.array(z.enum([
    'CONYUGE_O_CONVIVIENTE',
    'HIJO_A',
    'HERMANO_A',
    'PADRE_MADRE',
    'ABUELO_A',
    'NIETO_A'
  ])).optional(),
  parentescosAfinidad: z.array(z.enum(['SUEGROS', 'CUNADOS'])).optional(),
  rolesColaborador: z.array(z.enum(['ASISTENTE', 'ASESOR', 'PERSONA_CONFIANZA'])).optional()
}).optional()

// Esquema de forma de pago
export const FormaPagoSchema = z.object({
  cheque: z.object({
    activo: z.boolean().default(false),
    monto: z.number().nonnegative().optional(),
    banco: z.string().optional()
  }).optional(),
  efectivo: z.object({
    activo: z.boolean().default(false),
    monto: z.number().nonnegative().optional()
  }).optional(),
  transferencia: z.object({
    activo: z.boolean().default(false),
    monto: z.number().nonnegative().optional(),
    banco: z.string().optional()
  }).optional(),
  tarjeta: z.object({
    activo: z.boolean().default(false),
    monto: z.number().nonnegative().optional(),
    banco: z.string().optional()
  }).optional()
}).optional()

// Esquema principal del Formulario UAFE (Personas Naturales)
export const UAFEPersonaNaturalFormSchema = z.object({
  // INFORMACIÓN DEL TRÁMITE
  informacionTramite: z.object({
    fecha: z.string().optional(),
    numeroMatriz: z.string().optional(),
    actoContrato: z.string().optional(),
    avaluoMunicipal: z.string().optional(),
    valorContrato: z.string().optional()
  }).optional(),

  // FORMA DE PAGO
  formaPago: FormaPagoSchema,

  // UBICACIÓN DEL INMUEBLE (ubicación del inmueble del acto)
  ubicacionInmueble: z.object({
    callePrincipal: z.string().max(120).optional(),
    numero: z.string().max(20).optional(),
    calleSecundaria: z.string().max(120).optional(),
    provincia: z.string().max(60).optional(),
    canton: z.string().max(60).optional(),
    parroquia: z.string().max(60).optional()
  }).optional(),

  // PERSONAS QUE REALIZAN EL ACTO/CONTRATO
  personas: z.array(PersonaBasicaSchema).min(1).optional(),
  
  // DATOS DEL CÓNYUGE (condicional - solo si está casado)
  tieneConyuge: z.boolean().default(false),
  conyuge: PersonaBasicaSchema.optional(),
  informacionLaboralConyuge: InformacionLaboralSchema,

  // INFORMACIÓN LABORAL DE LA PERSONA NATURAL
  informacionLaboralTitular: InformacionLaboralSchema,

  // INFORMACIÓN ADICIONAL DE BENEFICIARIO FINAL/APODERADO/REPRESENTADO (condicional)
  tieneRepresentante: z.boolean().default(false),
  representante: PersonaBasicaSchema.optional(),

  // PERSONAS EXPUESTAS POLÍTICAMENTE (PEP)
  pep: PEPRelacionSchema
})

export type UAFEPersonaNaturalForm = z.infer<typeof UAFEPersonaNaturalFormSchema>

// Esquema para sesiones de formulario (lado compartido, sin autenticación)
export const FormSessionStatusSchema = z.enum(['DRAFT', 'PENDING_REVIEW', 'COMPLETED'])

export const FormSessionSchema = z.object({
  id: z.string(),
  accessId: z.string(),
  formType: z.enum(['UAFE_PERSONA_NATURAL']).default('UAFE_PERSONA_NATURAL'),
  documentId: z.string(),
  ownerNombre: z.string().optional(),
  ownerCedulaHint: z.string().optional(), // últimos 2-3 dígitos para mostrar pista
  status: FormSessionStatusSchema.default('DRAFT'),
  data: UAFEPersonaNaturalFormSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  expiresAt: z.string().optional()
})

export type FormSession = z.infer<typeof FormSessionSchema>


