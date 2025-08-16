import { z } from 'zod'

// Ecuador license plate regex patterns
const PLATE_WITH_DASH_REGEX = /^[A-Z]{3}-\d{3,4}$/
const PLATE_WITHOUT_DASH_REGEX = /^[A-Z]{3}\d{3,4}$/

// Vehicle type enumeration
export const VehicleTypeSchema = z.enum([
  'AUTOMOVIL',
  'CAMIONETA',
  'MOTOCICLETA',
  'CAMION',
  'BUS',
  'OTRO'
], {
  errorMap: () => ({ message: 'Tipo de vehículo debe ser válido' })
})

// Vehicle condition enumeration
export const VehicleConditionSchema = z.enum([
  'NUEVO',
  'USADO',
  'REPARADO'
], {
  errorMap: () => ({ message: 'Condición debe ser NUEVO, USADO o REPARADO' })
})

// Custom validation for Ecuador license plates
const validateEcuadorianPlate = (plate: string): boolean => {
  return PLATE_WITH_DASH_REGEX.test(plate) || PLATE_WITHOUT_DASH_REGEX.test(plate)
}

// Main Vehicle schema with Ecuador-specific validations
export const VehicleSchema = z.object({
  // Required vehicle identification
  placa: z.string()
    .min(6, 'Placa debe tener al menos 6 caracteres')
    .max(8, 'Placa no puede exceder 8 caracteres')
    .refine(validateEcuadorianPlate, {
      message: 'Formato de placa debe ser ABC-1234 o ABC1234'
    }),
  
  marca: z.string()
    .min(2, 'Marca debe tener al menos 2 caracteres')
    .max(50, 'Marca no puede exceder 50 caracteres'),
  
  modelo: z.string()
    .min(1, 'Modelo es obligatorio')
    .max(50, 'Modelo no puede exceder 50 caracteres'),
  
  numeroMotor: z.string()
    .min(5, 'Número de motor debe tener al menos 5 caracteres')
    .max(30, 'Número de motor no puede exceder 30 caracteres')
    .regex(/^[A-Z0-9]+$/, 'Número de motor solo puede contener letras y números'),
  
  numeroChasis: z.string()
    .min(10, 'Número de chasis debe tener al menos 10 caracteres')
    .max(25, 'Número de chasis no puede exceder 25 caracteres')
    .regex(/^[A-Z0-9]+$/, 'Número de chasis solo puede contener letras y números'),
  
  // Vehicle details
  anio: z.number()
    .int('Año debe ser un número entero')
    .min(1900, 'Año debe ser mayor a 1900')
    .max(new Date().getFullYear() + 1, 'Año no puede ser futuro'),
  
  tipo: VehicleTypeSchema,
  
  condicion: VehicleConditionSchema,
  
  // Optional fields
  color: z.string()
    .max(30, 'Color no puede exceder 30 caracteres')
    .optional(),
  
  cilindrada: z.string()
    .max(20, 'Cilindrada no puede exceder 20 caracteres')
    .optional(),
  
  combustible: z.enum(['GASOLINA', 'DIESEL', 'GAS', 'ELECTRICO', 'HIBRIDO'])
    .optional(),
  
  numeroAsientos: z.number()
    .int('Número de asientos debe ser entero')
    .min(1, 'Debe tener al menos 1 asiento')
    .max(100, 'No puede tener más de 100 asientos')
    .optional(),
  
  // Price information
  avaluo: z.number()
    .positive('Avalúo debe ser positivo')
    .optional(),
  
  precioVenta: z.number()
    .positive('Precio de venta debe ser positivo')
    .optional(),
  
  // Extraction metadata
  confidence: z.number()
    .min(0, 'Confidence debe ser mayor o igual a 0')
    .max(1, 'Confidence debe ser menor o igual a 1')
    .optional(),
  
  // Document source
  documentSource: z.string()
    .max(100, 'Fuente del documento no puede exceder 100 caracteres')
    .optional()
}).refine(
  (data) => {
    // Validate that chasis and motor numbers are different
    return data.numeroChasis !== data.numeroMotor
  },
  {
    message: 'Número de chasis y motor deben ser diferentes',
    path: ['numeroMotor']
  }
)

// Array schema for multiple vehicles
export const VehicleArraySchema = z.array(VehicleSchema)
  .min(1, 'Debe incluir al menos un vehículo')
  .max(5, 'No puede incluir más de 5 vehículos')

// Validation helpers
export const validatePlateFormat = (plate: string): boolean => {
  return validateEcuadorianPlate(plate)
}

export const normalizeePlate = (plate: string): string => {
  // Remove dash if present and convert to uppercase
  return plate.replace('-', '').toUpperCase()
}

export const formatPlate = (plate: string): string => {
  // Add dash if not present (ABC1234 -> ABC-1234)
  const normalized = normalizeePlate(plate)
  if (normalized.length >= 6) {
    return `${normalized.slice(0, 3)}-${normalized.slice(3)}`
  }
  return normalized
}