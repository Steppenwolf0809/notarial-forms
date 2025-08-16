import { z } from 'zod'

// Regex patterns for Ecuador ID validations
const CEDULA_REGEX = /^\d{10}$/
const RUC_REGEX = /^\d{13}001$/
const PASSPORT_REGEX = /^[A-Z0-9]{6,12}$/

// Person roles in notarial processes
export const PersonRoleSchema = z.enum([
  'COMPRADOR',
  'VENDEDOR', 
  'REPRESENTANTE'
], {
  errorMap: () => ({ message: 'Rol debe ser COMPRADOR, VENDEDOR o REPRESENTANTE' })
})

// Document type validation
export const DocumentTypeSchema = z.enum([
  'CEDULA',
  'RUC', 
  'PASAPORTE'
], {
  errorMap: () => ({ message: 'Tipo de documento debe ser CEDULA, RUC o PASAPORTE' })
})

// Custom validation for Ecuador identification documents
const validateEcuadorianDocument = (docType: string, docNumber: string) => {
  switch (docType) {
    case 'CEDULA':
      if (!CEDULA_REGEX.test(docNumber)) {
        return false
      }
      // Additional cedula validation logic can go here
      return true
    
    case 'RUC':
      if (!RUC_REGEX.test(docNumber)) {
        return false
      }
      return true
    
    case 'PASAPORTE':
      if (!PASSPORT_REGEX.test(docNumber)) {
        return false
      }
      return true
    
    default:
      return false
  }
}

// Main Person schema with Ecuador-specific validations
export const PersonSchema = z.object({
  // Personal information
  nombre: z.string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre no puede exceder 100 caracteres'),
  
  apellido: z.string()
    .min(2, 'Apellido debe tener al menos 2 caracteres')
    .max(100, 'Apellido no puede exceder 100 caracteres'),
  
  // Document information
  tipoDocumento: DocumentTypeSchema,
  
  numeroDocumento: z.string()
    .min(6, 'Número de documento debe tener al menos 6 caracteres')
    .max(13, 'Número de documento no puede exceder 13 caracteres'),
  
  // Nationality is required with no default
  nacionalidad: z.string()
    .min(2, 'Nacionalidad debe tener al menos 2 caracteres')
    .max(50, 'Nacionalidad no puede exceder 50 caracteres'),
  
  // Role in the notarial process
  rol: PersonRoleSchema,
  
  // Optional fields
  telefono: z.string()
    .regex(/^[0-9+\-\s()]+$/, 'Formato de teléfono inválido')
    .optional(),
  
  email: z.string()
    .email('Formato de email inválido')
    .optional(),
  
  direccion: z.string()
    .max(200, 'Dirección no puede exceder 200 caracteres')
    .optional(),
  
  // Extraction metadata
  confidence: z.number()
    .min(0, 'Confidence debe ser mayor o igual a 0')
    .max(1, 'Confidence debe ser menor o igual a 1')
    .optional()
}).refine(
  (data) => validateEcuadorianDocument(data.tipoDocumento, data.numeroDocumento),
  {
    message: 'Número de documento no es válido para el tipo especificado',
    path: ['numeroDocumento']
  }
)

// Array schema for multiple persons
export const PersonArraySchema = z.array(PersonSchema)
  .min(1, 'Debe incluir al menos una persona')
  .max(10, 'No puede incluir más de 10 personas')

// Validation helpers
export const validateCedula = (cedula: string): boolean => {
  return CEDULA_REGEX.test(cedula)
}

export const validateRuc = (ruc: string): boolean => {
  return RUC_REGEX.test(ruc)
}

export const validatePassport = (passport: string): boolean => {
  return PASSPORT_REGEX.test(passport)
}