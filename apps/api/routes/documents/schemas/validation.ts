import { z } from 'zod';

// Document status enum
export const DocumentStatusSchema = z.enum([
  'UPLOADED',
  'PROCESSING',
  'EXTRACTED',
  'SESSION_ACTIVE',
  'COMPLETED',
  'ERROR'
]);

// Document type enum
export const DocumentTypeSchema = z.enum([
  'PDF_EXTRACTO',
  'PDF_DILIGENCIA', 
  'SCREENSHOT_VEHICULO'
]);

// Tramite type enum
export const TramiteTypeSchema = z.enum([
  'COMPRAVENTA',
  'DONACION',
  'CONSTITUCION_SOCIEDAD',
  'FIDEICOMISO',
  'CONSORCIO',
  'VEHICULO',
  'DILIGENCIA',
  'OTRO'
]);

// File source enum
export const FileSourceSchema = z.enum([
  'drag_drop',
  'file_picker',
  'clipboard_paste'
]);

// Base64 file data schema
export const Base64FileSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.string().regex(/^(application\/pdf|image\/(png|jpe?g|bmp|tiff|webp))$/i),
  data: z.string().regex(/^data:[^;]+;base64,|^[A-Za-z0-9+/]*={0,2}$/),
  size: z.number().positive().max(52428800).optional(), // 50MB
  source: z.enum(['clipboard', 'file']).default('file'),
  metadata: z.object({
    timestamp: z.number().optional(),
    originalFormat: z.string().optional(),
    convertedFormat: z.string().optional()
  }).optional()
});

// Upload request schema
export const UploadRequestSchema = z.object({
  files: z.array(Base64FileSchema).min(1).max(10).optional(),
  notariaId: z.string().default('NOTARIA_18_QUITO'),
  autoProcess: z.boolean().default(true),
  metadata: z.object({
    clientName: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional()
  }).optional()
});

// Upload response schema
export const UploadResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    documents: z.array(z.object({
      id: z.string(),
      fileName: z.string(),
      originalName: z.string(),
      type: DocumentTypeSchema,
      status: DocumentStatusSchema,
      size: z.number(),
      uploadedAt: z.date(),
      source: FileSourceSchema,
      processingJobId: z.string().optional(),
      metadata: z.record(z.any()).optional()
    }))
  }).optional(),
  error: z.string().optional(),
  details: z.string().optional()
});

// Document query parameters
export const DocumentQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1).pipe(z.number().min(1).max(100)),
  limit: z.string().transform(val => parseInt(val) || 20).pipe(z.number().min(1).max(100)),
  status: DocumentStatusSchema.optional(),
  type: DocumentTypeSchema.optional(),
  notariaId: z.string().optional(),
  search: z.string().max(100).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  includeFields: z.enum(['true', 'false']).transform(val => val === 'true').default(false),
  includeSessions: z.enum(['true', 'false']).transform(val => val === 'true').default(false)
});

// Document response schema
export const DocumentResponseSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  originalName: z.string(),
  filePath: z.string(),
  type: DocumentTypeSchema,
  status: DocumentStatusSchema,
  size: z.number(),
  notariaId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  source: FileSourceSchema,
  metadata: z.record(z.any()).optional(),
  extractedFields: z.array(z.object({
    id: z.string(),
    fieldName: z.string(),
    value: z.string(),
    confidence: z.number().min(0).max(1),
    type: z.string().optional(),
    createdAt: z.date()
  })).optional(),
  activeSessions: z.array(z.object({
    id: z.string(),
    clientName: z.string(),
    tramiteType: TramiteTypeSchema,
    position: z.number(),
    status: z.enum(['ACTIVE', 'COMPLETED', 'EXPIRED']),
    createdAt: z.date(),
    expiresAt: z.date()
  })).optional()
});

// Process request schema
export const ProcessRequestSchema = z.object({
  documentId: z.string().cuid(),
  forceReprocess: z.boolean().default(false),
  options: z.object({
    minConfidence: z.number().min(0).max(1).default(0.7),
    extractImages: z.boolean().default(true),
    enhanceImage: z.boolean().default(true),
    ocrLanguage: z.enum(['spa', 'eng']).default('spa')
  }).optional()
});

// Processing status response schema
export const ProcessingStatusSchema = z.object({
  success: z.boolean(),
  data: z.object({
    jobId: z.string(),
    documentId: z.string(),
    status: z.enum(['queued', 'processing', 'completed', 'failed']),
    progress: z.number().min(0).max(100),
    startedAt: z.date().optional(),
    completedAt: z.date().optional(),
    error: z.string().optional(),
    result: z.object({
      documentType: DocumentTypeSchema,
      tramiteType: TramiteTypeSchema,
      confidence: z.number().min(0).max(1),
      fieldsCount: z.number(),
      processingTime: z.number(),
      extractedFields: z.array(z.object({
        fieldName: z.string(),
        value: z.string(),
        confidence: z.number().min(0).max(1),
        type: z.string().optional()
      }))
    }).optional()
  }).optional(),
  error: z.string().optional()
});

// Extracted data response schema for dynamic forms
export const ExtractedDataResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    documentId: z.string(),
    documentType: DocumentTypeSchema,
    tramiteType: TramiteTypeSchema,
    confidence: z.number().min(0).max(1),
    extractedAt: z.date(),
    formData: z.object({
      // Personal data
      personas: z.array(z.object({
        nombres: z.string().optional(),
        apellidos: z.string().optional(),
        nombreCompleto: z.string().optional(),
        cedula: z.string().optional(),
        ruc: z.string().optional(),
        pasaporte: z.string().optional(),
        telefono: z.string().optional(),
        email: z.string().optional(),
        direccion: z.string().optional(),
        nacionalidad: z.string().optional(),
        estadoCivil: z.string().optional(),
        profesion: z.string().optional()
      })).optional(),
      
      // Vehicle data
      vehiculo: z.object({
        marca: z.string().optional(),
        modelo: z.string().optional(),
        año: z.string().optional(),
        placa: z.string().optional(),
        motor: z.string().optional(),
        chasis: z.string().optional(),
        color: z.string().optional(),
        tipo: z.string().optional(),
        combustible: z.string().optional(),
        comprador: z.string().optional(),
        vendedor: z.string().optional(),
        valorVenta: z.string().optional(),
        formaPago: z.string().optional(),
        fechaTransferencia: z.date().optional()
      }).optional(),
      
      // Notarial data
      notarial: z.object({
        numeroEscritura: z.string().optional(),
        fechaEscritura: z.date().optional(),
        notario: z.string().optional(),
        canton: z.string().optional(),
        provincia: z.string().optional(),
        valorOperacion: z.string().optional(),
        formaPago: z.string().optional(),
        articulo29: z.boolean().optional(),
        descripcionInmueble: z.string().optional(),
        ubicacionInmueble: z.string().optional()
      }).optional(),
      
      // Company data
      sociedades: z.array(z.object({
        denominacion: z.string().optional(),
        ruc: z.string().optional(),
        tipoSociedad: z.string().optional(),
        capital: z.string().optional(),
        representanteLegal: z.string().optional(),
        objetoSocial: z.string().optional(),
        domicilio: z.string().optional()
      })).optional(),
      
      // Raw fields for fallback
      camposExtraidos: z.array(z.object({
        nombre: z.string(),
        valor: z.string(),
        confianza: z.number().min(0).max(1),
        tipo: z.string().optional()
      }))
    }),
    
    // Metadata
    metadata: z.object({
      source: FileSourceSchema,
      processingTime: z.number(),
      ocrEngine: z.string(),
      version: z.string(),
      clipboardData: z.object({
        originalFormat: z.string(),
        timestamp: z.number()
      }).optional()
    })
  }).optional(),
  error: z.string().optional()
});

// Error response schema
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  details: z.string().optional(),
  code: z.string().optional(),
  timestamp: z.date().default(() => new Date()),
  requestId: z.string().optional()
});

// Rate limiting schema
export const RateLimitSchema = z.object({
  windowMs: z.number().default(15 * 60 * 1000), // 15 minutes
  maxRequests: z.number().default(100),
  message: z.string().default('Too many requests, please try again later'),
  skipSuccessfulRequests: z.boolean().default(false),
  skipFailedRequests: z.boolean().default(false)
});

// Webhook notification schema
export const WebhookNotificationSchema = z.object({
  event: z.enum(['document.uploaded', 'document.processed', 'document.failed', 'session.created']),
  documentId: z.string(),
  timestamp: z.date(),
  data: z.record(z.any()),
  webhook: z.object({
    url: z.string().url(),
    secret: z.string().optional(),
    retryCount: z.number().default(0),
    maxRetries: z.number().default(3)
  })
});

// Validation middleware types
export type UploadRequest = z.infer<typeof UploadRequestSchema>;
export type UploadResponse = z.infer<typeof UploadResponseSchema>;
export type DocumentQuery = z.infer<typeof DocumentQuerySchema>;
export type DocumentResponse = z.infer<typeof DocumentResponseSchema>;
export type ProcessRequest = z.infer<typeof ProcessRequestSchema>;
export type ProcessingStatus = z.infer<typeof ProcessingStatusSchema>;
export type ExtractedDataResponse = z.infer<typeof ExtractedDataResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type WebhookNotification = z.infer<typeof WebhookNotificationSchema>;

// Validation functions
export const validateUploadRequest = (data: unknown) => UploadRequestSchema.parse(data);
export const validateDocumentQuery = (data: unknown) => DocumentQuerySchema.parse(data);
export const validateProcessRequest = (data: unknown) => ProcessRequestSchema.parse(data);

// Custom validation errors
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// File validation utilities
export const validateFileExtension = (filename: string, allowedExtensions: string[]): boolean => {
  const ext = filename.toLowerCase().split('.').pop();
  return ext ? allowedExtensions.includes(`.${ext}`) : false;
};

export const validateMimeType = (mimetype: string, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(mimetype.toLowerCase());
};

export const validateFileSize = (size: number, maxSize: number): boolean => {
  return size > 0 && size <= maxSize;
};

// Ecuador-specific validations
export const validateEcuadorianCedula = (cedula: string): boolean => {
  if (!/^\d{10}$/.test(cedula)) return false;
  
  const digits = cedula.split('').map(Number);
  const province = parseInt(cedula.substring(0, 2));
  
  if (province < 1 || province > 24) return false;
  
  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    let product = digits[i] * coefficients[i];
    if (product >= 10) product -= 9;
    sum += product;
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === digits[9];
};

export const validateEcuadorianRUC = (ruc: string): boolean => {
  if (!/^\d{13}001$/.test(ruc)) return false;
  
  const cedula = ruc.substring(0, 10);
  return validateEcuadorianCedula(cedula);
};

export const validateEcuadorianPlate = (plate: string): boolean => {
  const cleaned = plate.replace('-', '');
  return /^[A-Z]{3}\d{3,4}$/.test(cleaned) || /^[A-Z]{2}\d{4,5}$/.test(cleaned);
};