import { z } from 'zod'

// Import all schemas
import { 
  PersonSchema, 
  PersonRoleSchema, 
  DocumentTypeSchema,
  PersonArraySchema 
} from '../schemas/person.js'

import { 
  VehicleSchema, 
  VehicleTypeSchema, 
  VehicleConditionSchema,
  VehicleArraySchema 
} from '../schemas/vehicle.js'

import { 
  ExtractedDataSchema, 
  DocumentResultSchema,
  DocumentStatusSchema,
  DocumentPrioritySchema,
  ExtractionTypeSchema,
  BatchProcessingSchema,
  ConfidenceSchema
} from '../schemas/document.js'

import { 
  ActiveSessionSchema, 
  SessionStatusSchema,
  SessionPrioritySchema,
  TramiteTypeSchema,
  QueueStateSchema,
  CreateSessionSchema,
  UpdateSessionSchema
} from '../schemas/session.js'

// Person types
export type Person = z.infer<typeof PersonSchema>
export type PersonRole = z.infer<typeof PersonRoleSchema>
export type DocumentType = z.infer<typeof DocumentTypeSchema>
export type PersonArray = z.infer<typeof PersonArraySchema>

// Vehicle types  
export type Vehicle = z.infer<typeof VehicleSchema>
export type VehicleType = z.infer<typeof VehicleTypeSchema>
export type VehicleCondition = z.infer<typeof VehicleConditionSchema>
export type VehicleArray = z.infer<typeof VehicleArraySchema>

// Document types
export type ExtractedData = z.infer<typeof ExtractedDataSchema>
export type DocumentResult = z.infer<typeof DocumentResultSchema>
export type DocumentStatus = z.infer<typeof DocumentStatusSchema>
export type DocumentPriority = z.infer<typeof DocumentPrioritySchema>
export type ExtractionType = z.infer<typeof ExtractionTypeSchema>
export type BatchProcessing = z.infer<typeof BatchProcessingSchema>
export type ConfidenceScore = z.infer<typeof ConfidenceSchema>

// Session types
export type ActiveSession = z.infer<typeof ActiveSessionSchema>
export type SessionStatus = z.infer<typeof SessionStatusSchema>
export type SessionPriority = z.infer<typeof SessionPrioritySchema>
export type TramiteType = z.infer<typeof TramiteTypeSchema>
export type QueueState = z.infer<typeof QueueStateSchema>
export type CreateSession = z.infer<typeof CreateSessionSchema>
export type UpdateSession = z.infer<typeof UpdateSessionSchema>

// Utility types for API responses
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface ApiError {
  success: false
  error: string
  details?: Record<string, any>
  timestamp: string
}

export interface ApiSuccess<T> {
  success: true
  data: T
  message?: string
  timestamp: string
}

// Pagination types
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Filter types for search and queries
export interface PersonFilter {
  nombre?: string
  apellido?: string
  tipoDocumento?: DocumentType
  numeroDocumento?: string
  nacionalidad?: string
  rol?: PersonRole
}

export interface VehicleFilter {
  placa?: string
  marca?: string
  modelo?: string
  anio?: number
  tipo?: VehicleType
  condicion?: VehicleCondition
}

export interface SessionFilter {
  status?: SessionStatus
  tramiteType?: TramiteType
  priority?: SessionPriority
  notaryId?: string
  clientName?: string
  fromDate?: string
  toDate?: string
}

export interface DocumentFilter {
  status?: DocumentStatus
  tipo?: ExtractionType
  priority?: DocumentPriority
  fromDate?: string
  toDate?: string
  minConfidence?: number
  maxConfidence?: number
}

// Real-time event types
export interface QueueEvent {
  type: 'SESSION_ADDED' | 'SESSION_REMOVED' | 'SESSION_UPDATED' | 'POSITION_CHANGED'
  sessionId: string
  session?: ActiveSession
  oldPosition?: number
  newPosition?: number
  timestamp: string
}

export interface DocumentEvent {
  type: 'DOCUMENT_PROCESSED' | 'EXTRACTION_COMPLETED' | 'PROCESSING_ERROR'
  documentId: string
  document?: DocumentResult
  extractedData?: ExtractedData
  error?: string
  timestamp: string
}

// Notification types
export interface NotificationPayload {
  id: string
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO'
  title: string
  message: string
  sessionId?: string
  documentId?: string
  timestamp: string
  autoClose?: boolean
  duration?: number
}

// Statistics types
export interface QueueStatistics {
  totalSessions: number
  waitingSessions: number
  activeSessions: number
  completedToday: number
  averageWaitTimeMinutes: number
  averageProcessingTimeMinutes: number
  busyHours: Array<{ hour: number; count: number }>
  tramiteTypeDistribution: Array<{ type: TramiteType; count: number }>
  lastUpdated: string
}

export interface DocumentStatistics {
  totalDocuments: number
  processedToday: number
  averageConfidence: number
  processingTimeMs: number
  errorRate: number
  extractionTypeDistribution: Array<{ type: ExtractionType; count: number }>
  lastUpdated: string
}

// Configuration types
export interface NotaryOfficeConfig {
  id: string
  name: string
  address: string
  phone: string
  email: string
  workingHours: {
    start: string // HH:mm format
    end: string   // HH:mm format
    timezone: string
  }
  queueSettings: {
    maxSessions: number
    sessionTimeoutMinutes: number
    autoExpireMinutes: number
    allowPriority: boolean
  }
  documentSettings: {
    allowedTypes: ExtractionType[]
    minConfidence: number
    maxFileSize: number
    autoProcess: boolean
  }
}

// Validation result types
export interface ValidationResult<T = any> {
  success: boolean
  data?: T
  errors?: Array<{
    field: string
    message: string
    code: string
  }>
}

// Export utility type helpers
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Database entity types (for ORM integration)
export interface DatabaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export type PersonEntity = Person & DatabaseEntity
export type VehicleEntity = Vehicle & DatabaseEntity  
export type SessionEntity = ActiveSession & DatabaseEntity
export type DocumentEntity = DocumentResult & DatabaseEntity