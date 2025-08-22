// Export all schemas
export * from './schemas/person.js'
export * from './schemas/vehicle.js'
export * from './schemas/document.js'
export * from './schemas/session.js'
export * from './schemas/uafe.js'

// Export all types
export * from './types/index.js'

// Export stores
export * from './stores/queue.js'

// Re-export commonly used Zod utilities
export { z } from 'zod'

// Package version and metadata
export const PACKAGE_VERSION = '0.0.0'
export const PACKAGE_NAME = '@notarial-forms/shared-types'

// Common validation functions
export const createValidationError = (message: string, field?: string) => ({
  success: false as const,
  error: message,
  field,
  timestamp: new Date().toISOString()
})

export const createValidationSuccess = <T>(data: T, message?: string) => ({
  success: true as const,
  data,
  message,
  timestamp: new Date().toISOString()
})

// Ecuador-specific constants
export const ECUADOR_CONSTANTS = {
  CEDULA: {
    LENGTH: 10,
    REGEX: /^\d{10}$/,
    PROVINCES: [
      '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
      '21', '22', '23', '24'
    ]
  },
  RUC: {
    LENGTH: 13,
    REGEX: /^\d{13}001$/,
    SUFFIX: '001'
  },
  PASSPORT: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 12,
    REGEX: /^[A-Z0-9]{6,12}$/
  },
  VEHICLE_PLATE: {
    WITH_DASH: /^[A-Z]{3}-\d{3,4}$/,
    WITHOUT_DASH: /^[A-Z]{3}\d{3,4}$/,
    FORMAT: 'ABC-1234 or ABC1234'
  }
} as const

// Default configuration values
export const DEFAULT_CONFIG = {
  SESSION: {
    TIMEOUT_MINUTES: 120,
    MAX_SESSIONS: 100,
    AUTO_EXPIRE_MINUTES: 240
  },
  DOCUMENT: {
    MIN_CONFIDENCE: 0.7,
    MAX_FILE_SIZE_MB: 50,
    ALLOWED_MIME_TYPES: ['application/pdf', 'image/jpeg', 'image/png']
  },
  QUEUE: {
    UPDATE_INTERVAL_MS: 5000,
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 1000
  }
} as const

// Error codes for standardized error handling
export const ERROR_CODES = {
  // Validation errors
  INVALID_CEDULA: 'INVALID_CEDULA',
  INVALID_RUC: 'INVALID_RUC', 
  INVALID_PASSPORT: 'INVALID_PASSPORT',
  INVALID_PLATE: 'INVALID_PLATE',
  INVALID_CONFIDENCE: 'INVALID_CONFIDENCE',
  
  // Session errors
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  POSITION_OCCUPIED: 'POSITION_OCCUPIED',
  QUEUE_FULL: 'QUEUE_FULL',
  
  // Document errors
  DOCUMENT_NOT_FOUND: 'DOCUMENT_NOT_FOUND',
  EXTRACTION_FAILED: 'EXTRACTION_FAILED',
  PROCESSING_ERROR: 'PROCESSING_ERROR',
  UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',
  
  // Payment validation errors - Artículo 29
  INVALID_VALOR_OPERACION: 'INVALID_VALOR_OPERACION',
  MISSING_MONEDA: 'MISSING_MONEDA',
  MISSING_FORMA_PAGO: 'MISSING_FORMA_PAGO',
  MISSING_PAGO_ANTERIOR: 'MISSING_PAGO_ANTERIOR',
  MISSING_DECLARACION: 'MISSING_DECLARACION',
  INVALID_PAYMENT_INFO: 'INVALID_PAYMENT_INFO',
  
  // General errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN'
} as const

// Success messages in Spanish
export const SUCCESS_MESSAGES = {
  SESSION_CREATED: 'Sesión creada exitosamente',
  SESSION_UPDATED: 'Sesión actualizada exitosamente',
  SESSION_COMPLETED: 'Sesión completada exitosamente',
  DOCUMENT_PROCESSED: 'Documento procesado exitosamente',
  EXTRACTION_COMPLETED: 'Extracción de datos completada',
  QUEUE_UPDATED: 'Cola actualizada exitosamente'
} as const

// Error messages in Spanish
export const ERROR_MESSAGES = {
  [ERROR_CODES.INVALID_CEDULA]: 'Cédula ecuatoriana inválida. Debe tener 10 dígitos.',
  [ERROR_CODES.INVALID_RUC]: 'RUC inválido. Debe tener 13 dígitos terminados en 001.',
  [ERROR_CODES.INVALID_PASSPORT]: 'Pasaporte inválido. Debe ser alfanumérico de 6-12 caracteres.',
  [ERROR_CODES.INVALID_PLATE]: 'Placa inválida. Formato debe ser ABC-1234 o ABC1234.',
  [ERROR_CODES.INVALID_CONFIDENCE]: 'Nivel de confianza debe estar entre 0 y 1.',
  [ERROR_CODES.SESSION_NOT_FOUND]: 'Sesión no encontrada.',
  [ERROR_CODES.SESSION_EXPIRED]: 'La sesión ha expirado.',
  [ERROR_CODES.POSITION_OCCUPIED]: 'La posición en la cola ya está ocupada.',
  [ERROR_CODES.QUEUE_FULL]: 'La cola está llena. Intente más tarde.',
  [ERROR_CODES.DOCUMENT_NOT_FOUND]: 'Documento no encontrado.',
  [ERROR_CODES.EXTRACTION_FAILED]: 'Error al extraer datos del documento.',
  [ERROR_CODES.PROCESSING_ERROR]: 'Error al procesar el documento.',
  [ERROR_CODES.UNSUPPORTED_FORMAT]: 'Formato de documento no soportado.',
  [ERROR_CODES.INVALID_VALOR_OPERACION]: 'Valor de operación inválido.',
  [ERROR_CODES.MISSING_MONEDA]: 'Para operaciones de $10,000 USD o más, la moneda es obligatoria.',
  [ERROR_CODES.MISSING_FORMA_PAGO]: 'Debe especificar al menos una forma de pago.',
  [ERROR_CODES.MISSING_PAGO_ANTERIOR]: 'Para operaciones incompletas, debe especificar si hubo pago anterior.',
  [ERROR_CODES.MISSING_DECLARACION]: 'Para operaciones menores a $10,000 USD ya pagadas, se requiere declaración.',
  [ERROR_CODES.INVALID_PAYMENT_INFO]: 'Documentos societarios, fiduciarios, donaciones y consorcios requieren información de pago.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Error de validación de datos.',
  [ERROR_CODES.NETWORK_ERROR]: 'Error de conexión de red.',
  [ERROR_CODES.SERVER_ERROR]: 'Error interno del servidor.',
  [ERROR_CODES.UNAUTHORIZED]: 'No autorizado. Inicie sesión.',
  [ERROR_CODES.FORBIDDEN]: 'Acceso denegado. Permisos insuficientes.'
} as const

// Type guards for runtime type checking
export const isValidCedula = (value: string): boolean => {
  return ECUADOR_CONSTANTS.CEDULA.REGEX.test(value)
}

export const isValidRuc = (value: string): boolean => {
  return ECUADOR_CONSTANTS.RUC.REGEX.test(value)
}

export const isValidPassport = (value: string): boolean => {
  return ECUADOR_CONSTANTS.PASSPORT.REGEX.test(value)
}

export const isValidPlate = (value: string): boolean => {
  return ECUADOR_CONSTANTS.VEHICLE_PLATE.WITH_DASH.test(value) || 
         ECUADOR_CONSTANTS.VEHICLE_PLATE.WITHOUT_DASH.test(value)
}

export const isValidConfidence = (value: number): boolean => {
  return value >= 0 && value <= 1
}

// Artículo 29 validation helpers
export const isArticle29Document = (tipo: string): boolean => {
  return ['PDF_SOCIETARIO', 'PDF_FIDUCIARIO', 'PDF_DONACION', 'PDF_CONSORCIO'].includes(tipo)
}

export const requiresMonedaField = (valorOperacion?: number): boolean => {
  return valorOperacion !== undefined && valorOperacion >= 10000
}

export const requiresDeclaracionField = (valorOperacion?: number, pagoAnterior?: boolean): boolean => {
  return valorOperacion !== undefined && valorOperacion < 10000 && pagoAnterior === true
}

export const isValidFormaPago = (formaPago: string): boolean => {
  return ['EFECTIVO', 'TRANSFERENCIA', 'CHEQUE', 'FINANCIAMIENTO', 'MIXTO'].includes(formaPago)
}

export const isValidMoneda = (moneda: string): boolean => {
  return ['USD', 'DOLARES'].includes(moneda)
}