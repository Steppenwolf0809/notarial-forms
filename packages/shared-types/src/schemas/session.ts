import { z } from 'zod'
import dayjs from 'dayjs'

// Tramite types for notarial processes (extracted from documents) - Artículo 29
export const TramiteTypeSchema = z.enum([
  'COMPRAVENTA',
  'VEHICULO', 
  'DILIGENCIA',
  'ESCRITURA_PUBLICA',
  'TESTAMENTO',
  'PODER_GENERAL',
  'PODER_ESPECIAL',
  'HIPOTECA',
  'CANCELACION_HIPOTECA',
  'CONSTITUCION_COMPANIA',
  'AUMENTO_CAPITAL',
  'REDUCCION_CAPITAL',
  'DISOLUCION_COMPANIA',
  'NOMBRAMIENTO',
  'CESION_DERECHOS',
  'DONACION',
  'PERMUTA',
  'ANTICRESIS',
  'USUFRUCTO',
  'SERVIDUMBRE',
  'DECLARACION_HEREDEROS',
  'PARTICION_BIENES',
  'RECONOCIMIENTO_FIRMA',
  'LEGALIZACION',
  'PROTESTO',
  'INVENTARIO',
  'AVALUO',
  'REMATE',
  'ADJUDICACION',
  'SOCIETARIO',       // Actos societarios - Artículo 29
  'FIDUCIARIO',       // Contratos fiduciarios - Artículo 29
  'CONSORCIO',        // Consorcios - Artículo 29
  'OTRO'
], {
  errorMap: () => ({ message: 'Tipo de trámite no válido' })
})

// Session status enumeration
export const SessionStatusSchema = z.enum([
  'WAITING',
  'ACTIVE',
  'PAUSED',
  'COMPLETED',
  'EXPIRED',
  'CANCELLED'
], {
  errorMap: () => ({ message: 'Estado de sesión inválido' })
})

// Session priority levels
export const SessionPrioritySchema = z.enum([
  'LOW',
  'NORMAL', 
  'HIGH',
  'URGENT'
], {
  errorMap: () => ({ message: 'Prioridad debe ser LOW, NORMAL, HIGH o URGENT' })
})

// Helper function to generate expiration time (2 hours from now)
const generateExpirationTime = (): string => {
  return dayjs().add(2, 'hours').toISOString()
}

// Base session schema without refines (for omit/partial operations)
const BaseActiveSessionSchema = z.object({
  // Session identification
  id: z.string()
    .min(1, 'ID de sesión es obligatorio'),
  
  // Client information extracted from personas
  clientName: z.string()
    .min(2, 'Nombre del cliente debe tener al menos 2 caracteres')
    .max(200, 'Nombre del cliente no puede exceder 200 caracteres'),
  
  // Document reference
  documentId: z.string()
    .min(1, 'ID del documento es obligatorio'),
  
  // Process information
  tramiteType: TramiteTypeSchema,
  
  // Queue management - position must be unique per notary office
  position: z.number()
    .int('Posición debe ser un número entero')
    .min(1, 'Posición debe ser mayor a 0')
    .max(1000, 'Posición no puede exceder 1000'),
  
  // Session timing
  expires: z.string()
    .datetime('Fecha de expiración debe ser datetime válido')
    .refine((date) => {
      const expirationDate = new Date(date)
      const now = new Date()
      return expirationDate > now
    }, {
      message: 'Fecha de expiración debe ser futura'
    }),
  
  // Session metadata
  status: SessionStatusSchema.default('WAITING'),
  
  priority: SessionPrioritySchema.default('NORMAL'),
  
  createdAt: z.string()
    .datetime('Fecha de creación debe ser datetime válido')
    .default(() => dayjs().toISOString()),
  
  updatedAt: z.string()
    .datetime('Fecha de actualización debe ser datetime válido')
    .default(() => dayjs().toISOString()),
  
  startedAt: z.string()
    .datetime('Fecha de inicio debe ser datetime válido')
    .optional(),
  
  completedAt: z.string()
    .datetime('Fecha de finalización debe ser datetime válido')
    .optional(),
  
  // Notary office information
  notaryId: z.string()
    .min(1, 'ID de notaría es obligatorio'),
  
  notaryName: z.string()
    .max(100, 'Nombre de notaría no puede exceder 100 caracteres')
    .optional(),
  
  // Additional client information
  clientPhone: z.string()
    .regex(/^[0-9+\-\s()]+$/, 'Formato de teléfono inválido')
    .optional(),
  
  clientEmail: z.string()
    .email('Formato de email inválido')
    .optional(),
  
  // Session notes
  notes: z.string()
    .max(500, 'Notas no pueden exceder 500 caracteres')
    .optional(),
  
  // Estimated processing time
  estimatedDurationMinutes: z.number()
    .int('Duración estimada debe ser entero')
    .min(1, 'Duración mínima es 1 minuto')
    .max(480, 'Duración máxima es 8 horas')
    .optional(),
  
  // Session analytics
  waitTimeMinutes: z.number()
    .int('Tiempo de espera debe ser entero')
    .min(0, 'Tiempo de espera no puede ser negativo')
    .optional(),
  
  processingTimeMinutes: z.number()
    .int('Tiempo de procesamiento debe ser entero')
    .min(0, 'Tiempo de procesamiento no puede ser negativo')
    .optional()
})

// Active session schema with validations
export const ActiveSessionSchema = BaseActiveSessionSchema.refine(
  (data) => {
    // If session is completed, it must have completedAt
    if (data.status === 'COMPLETED') {
      return !!data.completedAt
    }
    return true
  },
  {
    message: 'Sesiones completadas deben tener fecha de finalización',
    path: ['completedAt']
  }
).refine(
  (data) => {
    // If session is active, it must have startedAt
    if (data.status === 'ACTIVE') {
      return !!data.startedAt
    }
    return true
  },
  {
    message: 'Sesiones activas deben tener fecha de inicio',
    path: ['startedAt']
  }
)

// Queue state schema for entire notary office
export const QueueStateSchema = z.object({
  notaryId: z.string(),
  activeSessions: z.array(ActiveSessionSchema),
  totalSessions: z.number().int().min(0),
  waitingCount: z.number().int().min(0),
  activeCount: z.number().int().min(0),
  completedToday: z.number().int().min(0),
  averageWaitTimeMinutes: z.number().min(0).optional(),
  lastUpdated: z.string().datetime()
})

// Session creation schema with defaults
export const CreateSessionSchema = BaseActiveSessionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  priority: true
}).extend({
  // Override expires to auto-generate 2 hours from now
  expires: z.string()
    .datetime()
    .default(() => generateExpirationTime())
})

// Session update schema
export const UpdateSessionSchema = BaseActiveSessionSchema.partial().extend({
  id: z.string().min(1, 'ID es obligatorio'),
  updatedAt: z.string()
    .datetime()
    .default(() => dayjs().toISOString())
})

// Validation helpers
export const validateSessionPosition = (position: number, existingPositions: number[]): boolean => {
  return !existingPositions.includes(position)
}

export const isSessionExpired = (expiresAt: string): boolean => {
  return dayjs().isAfter(dayjs(expiresAt))
}

export const getSessionWaitTime = (createdAt: string, startedAt?: string): number => {
  const start = dayjs(createdAt)
  const end = startedAt ? dayjs(startedAt) : dayjs()
  return end.diff(start, 'minutes')
}

export const getSessionProcessingTime = (startedAt: string, completedAt?: string): number => {
  if (!startedAt) return 0
  const start = dayjs(startedAt)
  const end = completedAt ? dayjs(completedAt) : dayjs()
  return end.diff(start, 'minutes')
}

export const generateSessionId = (): string => {
  return `session_${dayjs().format('YYYYMMDD_HHmmss')}_${Math.random().toString(36).substr(2, 9)}`
}