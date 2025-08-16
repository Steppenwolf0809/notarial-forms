import { z } from 'zod'
import { PersonArraySchema } from './person.js'
import { VehicleArraySchema } from './vehicle.js'

// Forma de pago enum - Artículo 29 obligaciones notariales
export const FormaPagoSchema = z.enum([
  'EFECTIVO',
  'TRANSFERENCIA',
  'CHEQUE',
  'FINANCIAMIENTO',
  'MIXTO'
], {
  errorMap: () => ({ message: 'Forma de pago debe ser EFECTIVO, TRANSFERENCIA, CHEQUE, FINANCIAMIENTO o MIXTO' })
})

// Moneda enum para operaciones >= $10,000 USD
export const MonedaSchema = z.enum([
  'USD',
  'DOLARES'
], {
  errorMap: () => ({ message: 'Moneda debe ser USD o DOLARES para operaciones mayores o iguales a $10,000' })
})

// Document extraction types - Artículo 29 obligaciones notariales ecuatorianas
export const ExtractionTypeSchema = z.enum([
  'PDF_EXTRACTO',
  'PDF_DILIGENCIA', 
  'SCREENSHOT_VEHICULO',
  'PDF_SOCIETARIO',     // Conformación y reestructuración societaria
  'PDF_FIDUCIARIO',     // Creación, operación, administración, liquidación contratos fiduciarios
  'PDF_DONACION',       // Donaciones y cesiones de derechos
  'PDF_CONSORCIO'       // Creación, operación, administración, liquidación consorcios
], {
  errorMap: () => ({ message: 'Tipo de extracción no válido. Debe ser PDF_EXTRACTO, PDF_DILIGENCIA, SCREENSHOT_VEHICULO, PDF_SOCIETARIO, PDF_FIDUCIARIO, PDF_DONACION o PDF_CONSORCIO' })
})

// Document status for processing
export const DocumentStatusSchema = z.enum([
  'PENDING',
  'PROCESSING', 
  'COMPLETED',
  'ERROR',
  'EXPIRED'
], {
  errorMap: () => ({ message: 'Estado del documento inválido' })
})

// Document priority levels
export const DocumentPrioritySchema = z.enum([
  'LOW',
  'NORMAL',
  'HIGH',
  'URGENT'
], {
  errorMap: () => ({ message: 'Prioridad debe ser LOW, NORMAL, HIGH o URGENT' })
})

// Confidence score validation
export const ConfidenceSchema = z.number()
  .min(0, 'Confidence debe ser mayor o igual a 0')
  .max(1, 'Confidence debe ser menor o igual a 1')

// Main extracted data schema
export const ExtractedDataSchema = z.object({
  // Required fields - no defaults per requirement
  personas: PersonArraySchema,
  
  confidence: ConfidenceSchema,
  
  fecha: z.string()
    .datetime('Fecha debe ser un datetime válido ISO 8601')
    .refine((date) => {
      const parsedDate = new Date(date)
      const now = new Date()
      // Allow dates from 100 years ago to 1 year in the future
      const minDate = new Date(now.getFullYear() - 100, 0, 1)
      const maxDate = new Date(now.getFullYear() + 1, 11, 31)
      return parsedDate >= minDate && parsedDate <= maxDate
    }, {
      message: 'Fecha debe estar en un rango válido'
    }),
  
  tipo: ExtractionTypeSchema,
  
  // Optional vehicle data (required for vehicle-related documents)
  vehiculos: VehicleArraySchema.optional(),
  
  // Campos obligatorios Artículo 29 - Información de pago
  valorOperacion: z.number()
    .positive('Valor de operación debe ser positivo')
    .optional(),
  
  moneda: MonedaSchema.optional(),
  
  formaPago: z.array(FormaPagoSchema)
    .min(1, 'Debe especificar al menos una forma de pago')
    .optional(),
  
  esOperacionCompleta: z.boolean()
    .optional(),
  
  pagoAnterior: z.boolean()
    .optional(),
  
  requiereDeclaracion: z.boolean()
    .optional(),
  
  observacionesPago: z.string()
    .max(500, 'Observaciones de pago no pueden exceder 500 caracteres')
    .optional(),
  
  // Document metadata
  documentId: z.string()
    .min(1, 'ID del documento es obligatorio')
    .max(100, 'ID del documento no puede exceder 100 caracteres'),
  
  fileName: z.string()
    .min(1, 'Nombre del archivo es obligatorio')
    .max(255, 'Nombre del archivo no puede exceder 255 caracteres'),
  
  fileSize: z.number()
    .int('Tamaño del archivo debe ser entero')
    .positive('Tamaño del archivo debe ser positivo')
    .optional(),
  
  mimeType: z.string()
    .max(50, 'Tipo MIME no puede exceder 50 caracteres')
    .optional(),
  
  // Processing metadata
  extractedAt: z.string()
    .datetime('Fecha de extracción debe ser datetime válido')
    .optional(),
  
  processingTimeMs: z.number()
    .int('Tiempo de procesamiento debe ser entero')
    .min(0, 'Tiempo de procesamiento no puede ser negativo')
    .optional(),
  
  // Error information
  errors: z.array(z.string()).optional(),
  
  warnings: z.array(z.string()).optional(),
  
  // Additional extracted fields
  extractedFields: z.record(z.string(), z.any()).optional()
}).refine(
  (data) => {
    // Vehicle documents must have vehicles
    if (data.tipo === 'SCREENSHOT_VEHICULO') {
      return data.vehiculos && data.vehiculos.length > 0
    }
    return true
  },
  {
    message: 'Documentos de vehículos deben incluir información de vehículos',
    path: ['vehiculos']
  }
).refine(
  (data) => {
    // High confidence scores should have fewer errors
    if (data.confidence > 0.9 && data.errors && data.errors.length > 5) {
      return false
    }
    return true
  },
  {
    message: 'Documentos con alta confianza no deberían tener muchos errores',
    path: ['confidence']
  }
).refine(
  (data) => {
    // Artículo 29: Si valorOperacion >= 10000 entonces moneda es obligatorio
    if (data.valorOperacion && data.valorOperacion >= 10000) {
      return !!data.moneda
    }
    return true
  },
  {
    message: 'Para operaciones de $10,000 USD o más, la moneda es obligatoria',
    path: ['moneda']
  }
).refine(
  (data) => {
    // Artículo 29: Si esOperacionCompleta false entonces pagoAnterior obligatorio
    if (data.esOperacionCompleta === false) {
      return data.pagoAnterior !== undefined
    }
    return true
  },
  {
    message: 'Para operaciones incompletas, debe especificar si hubo pago anterior',
    path: ['pagoAnterior']
  }
).refine(
  (data) => {
    // Artículo 29: Si valorOperacion < 10000 y pagoAnterior true entonces requiereDeclaracion true
    if (data.valorOperacion && data.valorOperacion < 10000 && data.pagoAnterior === true) {
      return data.requiereDeclaracion === true
    }
    return true
  },
  {
    message: 'Para operaciones menores a $10,000 USD ya pagadas, se requiere declaración',
    path: ['requiereDeclaracion']
  }
).refine(
  (data) => {
    // Artículo 29: formaPago array mínimo 1 elemento cuando hay valorOperacion
    if (data.valorOperacion && data.valorOperacion > 0) {
      return data.formaPago && data.formaPago.length >= 1
    }
    return true
  },
  {
    message: 'Debe especificar al menos una forma de pago para operaciones con valor',
    path: ['formaPago']
  }
).refine(
  (data) => {
    // Artículo 29: Documentos societarios, fiduciarios, donación y consorcio requieren información de pago
    const requiresPaymentInfo = ['PDF_SOCIETARIO', 'PDF_FIDUCIARIO', 'PDF_DONACION', 'PDF_CONSORCIO']
    if (requiresPaymentInfo.includes(data.tipo)) {
      return data.valorOperacion !== undefined || data.observacionesPago
    }
    return true
  },
  {
    message: 'Documentos societarios, fiduciarios, donaciones y consorcios requieren información de pago',
    path: ['valorOperacion']
  }
)

// Document processing result schema
export const DocumentResultSchema = z.object({
  id: z.string(),
  status: DocumentStatusSchema,
  priority: DocumentPrioritySchema.default('NORMAL'),
  extractedData: ExtractedDataSchema.optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  processedAt: z.string().datetime().optional(),
  
  // Processing statistics
  processingAttempts: z.number().int().min(0).default(0),
  lastError: z.string().optional(),
  
  // Notarial office information
  notaryId: z.string().optional(),
  notaryName: z.string().optional()
})

// Batch processing schema
export const BatchProcessingSchema = z.object({
  batchId: z.string(),
  documents: z.array(DocumentResultSchema),
  totalDocuments: z.number().int().min(0),
  processedDocuments: z.number().int().min(0),
  failedDocuments: z.number().int().min(0),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  estimatedCompletionTime: z.string().datetime().optional()
})

// Validation helpers
export const validateExtractionData = (data: unknown) => {
  return ExtractedDataSchema.safeParse(data)
}

export const validateDocumentResult = (data: unknown) => {
  return DocumentResultSchema.safeParse(data)
}

export const isVehicleDocument = (tipo: string): boolean => {
  return tipo === 'SCREENSHOT_VEHICULO'
}

export const isPDFDocument = (tipo: string): boolean => {
  return tipo === 'PDF_EXTRACTO' || tipo === 'PDF_DILIGENCIA'
}

export const isArticle29Document = (tipo: string): boolean => {
  return ['PDF_SOCIETARIO', 'PDF_FIDUCIARIO', 'PDF_DONACION', 'PDF_CONSORCIO'].includes(tipo)
}

export const requiresPaymentInfo = (tipo: string): boolean => {
  return isArticle29Document(tipo)
}

export const requiresMoneda = (valorOperacion?: number): boolean => {
  return valorOperacion !== undefined && valorOperacion >= 10000
}

export const requiresDeclaracion = (valorOperacion?: number, pagoAnterior?: boolean): boolean => {
  return valorOperacion !== undefined && valorOperacion < 10000 && pagoAnterior === true
}