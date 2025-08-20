import { z } from 'zod';

// Session Status Types
export const SessionStatusSchema = z.enum([
  'WAITING',    // En cola esperando
  'ACTIVE',     // Turno activo (siendo atendido)
  'READY',      // Listo para ser llamado
  'COMPLETED',  // Completado exitosamente
  'EXPIRED',    // Expirado por inactividad
  'CANCELLED'   // Cancelado manualmente
]);

// Tramite Types
export const TramiteTypeSchema = z.enum([
  'COMPRAVENTA',
  'DONACION', 
  'CONSTITUCION_SOCIEDAD',
  'FIDEICOMISO',
  'CONSORCIO',
  'VEHICULO',
  'DILIGENCIA',
  'HIPOTECA',
  'PODER',
  'TESTAMENTO',
  'OTRO'
]);

// Priority Levels
export const PriorityLevelSchema = z.enum([
  'LOW',      // 0-2: Trámites normales
  'NORMAL',   // 3-5: Trámites regulares  
  'HIGH',     // 6-8: Trámites urgentes
  'CRITICAL'  // 9-10: Trámites críticos/VIP
]);

// Queue Configuration Schema
export const QueueConfigSchema = z.object({
  notariaId: z.string(),
  maxConcurrentSessions: z.number().default(5),
  sessionTimeoutMinutes: z.number().default(120), // 2 horas default
  readyTimeoutMinutes: z.number().default(15),    // 15 minutos para responder
  estimatedTimePerTramite: z.number().default(20), // 20 minutos promedio
  enablePriorities: z.boolean().default(true),
  autoExpireInactive: z.boolean().default(true),
  notificationSettings: z.object({
    enablePush: z.boolean().default(true),
    enableSound: z.boolean().default(true),
    reminderMinutes: z.array(z.number()).default([5, 2]) // Recordatorios a 5 y 2 min
  }).optional()
});

// Active Session Schema
export const ActiveSessionSchema = z.object({
  id: z.string().cuid(),
  documentId: z.string(),
  notariaId: z.string(),
  clientName: z.string().min(1),
  tramiteType: TramiteTypeSchema,
  status: SessionStatusSchema,
  priority: PriorityLevelSchema.default('NORMAL'),
  position: z.number().positive(),
  estimatedWaitTime: z.number().nonnegative(), // minutos
  createdAt: z.date(),
  updatedAt: z.date(),
  expiresAt: z.date(),
  readyAt: z.date().optional(),
  calledAt: z.date().optional(),
  completedAt: z.date().optional(),
  metadata: z.object({
    clientPhone: z.string().optional(),
    clientEmail: z.string().optional(),
    notes: z.string().optional(),
    requestedBy: z.string().optional(), // Matriculador
    documentType: z.string().optional(),
    extractedFields: z.number().optional(),
    processingTime: z.number().optional(),
    socketId: z.string().optional(), // Para notificaciones
    remindersSent: z.array(z.number()).default([]),
    totalWaitTime: z.number().optional()
  }).optional()
});

// Queue Statistics Schema
export const QueueStatsSchema = z.object({
  notariaId: z.string(),
  timestamp: z.date(),
  totalSessions: z.number(),
  waitingSessions: z.number(),
  activeSessions: z.number(),
  readySessions: z.number(),
  completedToday: z.number(),
  averageWaitTime: z.number(), // minutos
  averageServiceTime: z.number(), // minutos
  longestWaitTime: z.number(),
  shortestWaitTime: z.number(),
  tramiteTypeDistribution: z.record(z.number()),
  priorityDistribution: z.record(z.number()),
  hourlyActivity: z.array(z.object({
    hour: z.number(),
    count: z.number(),
    avgWaitTime: z.number()
  })),
  peakHours: z.array(z.number())
});

// Socket Events Schema
export const SocketEventSchema = z.enum([
  // Client -> Server
  'join-notaria',
  'join-session', 
  'leave-notaria',
  'leave-session',
  'heartbeat',
  'client-ready',
  'cancel-session',
  'request-position',
  
  // Server -> Client
  'queue-updated',
  'session-ready',
  'session-called',
  'session-expired', 
  'session-cancelled',
  'position-updated',
  'wait-time-updated',
  'notification',
  'stats-updated',
  'error',
  'reconnected',
  
  // Admin Events
  'admin-join',
  'call-next',
  'complete-session',
  'extend-session',
  'priority-updated',
  'queue-paused',
  'queue-resumed'
]);

// Notification Types
export const NotificationTypeSchema = z.enum([
  'SESSION_READY',      // Tu turno está listo
  'SESSION_CALLED',     // Estás siendo llamado
  'POSITION_UPDATE',    // Tu posición ha cambiado
  'WAIT_TIME_UPDATE',   // Tiempo de espera actualizado
  'SESSION_EXPIRING',   // Tu sesión está por expirar
  'SESSION_EXPIRED',    // Tu sesión ha expirado
  'QUEUE_PAUSED',       // Cola pausada
  'QUEUE_RESUMED',      // Cola reanudada
  'REMINDER'            // Recordatorio general
]);

// QR Code Configuration
export const QRConfigSchema = z.object({
  notariaId: z.string(),
  baseUrl: z.string().url(),
  size: z.number().default(200),
  margin: z.number().default(2),
  errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).default('M'),
  type: z.enum(['png', 'svg']).default('png'),
  darkColor: z.string().default('#000000'),
  lightColor: z.string().default('#FFFFFF'),
  logo: z.string().optional(), // Base64 or URL
  customData: z.object({
    name: z.string(),
    address: z.string().optional(),
    phone: z.string().optional(),
    theme: z.string().optional()
  }).optional()
});

// WebSocket Connection Info
export const ConnectionInfoSchema = z.object({
  socketId: z.string(),
  userId: z.string().optional(),
  userType: z.enum(['CLIENT', 'ADMIN', 'MATRICULADOR']).default('CLIENT'),
  notariaId: z.string(),
  sessionId: z.string().optional(),
  connectedAt: z.date(),
  lastActivity: z.date(),
  isActive: z.boolean().default(true),
  metadata: z.object({
    userAgent: z.string().optional(),
    ipAddress: z.string().optional(),
    device: z.string().optional(),
    browser: z.string().optional()
  }).optional()
});

// Redis Cache Schemas
export const CacheKeySchema = z.object({
  type: z.enum(['queue', 'session', 'stats', 'config', 'qr']),
  notariaId: z.string(),
  identifier: z.string().optional(),
  ttl: z.number().default(300) // 5 minutes default
});

// Event Log Schema
export const EventLogSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.date(),
  event: SocketEventSchema,
  notariaId: z.string(),
  sessionId: z.string().optional(),
  socketId: z.string().optional(),
  userId: z.string().optional(),
  data: z.record(z.any()).optional(),
  metadata: z.object({
    userAgent: z.string().optional(),
    ipAddress: z.string().optional(),
    processingTime: z.number().optional()
  }).optional()
});

// Error Types
export const QueueErrorSchema = z.object({
  code: z.enum([
    'SESSION_NOT_FOUND',
    'SESSION_EXPIRED',
    'QUEUE_FULL',
    'INVALID_POSITION',
    'DUPLICATE_SESSION',
    'NOTARIA_NOT_FOUND',
    'CONNECTION_ERROR',
    'VALIDATION_ERROR',
    'DATABASE_ERROR',
    'REDIS_ERROR',
    'UNAUTHORIZED',
    'RATE_LIMITED'
  ]),
  message: z.string(),
  details: z.string().optional(),
  sessionId: z.string().optional(),
  notariaId: z.string().optional(),
  timestamp: z.date()
});

// Type exports
export type SessionStatus = z.infer<typeof SessionStatusSchema>;
export type TramiteType = z.infer<typeof TramiteTypeSchema>;
export type PriorityLevel = z.infer<typeof PriorityLevelSchema>;
export type QueueConfig = z.infer<typeof QueueConfigSchema>;
export type ActiveSession = z.infer<typeof ActiveSessionSchema>;
export type QueueStats = z.infer<typeof QueueStatsSchema>;
export type SocketEvent = z.infer<typeof SocketEventSchema>;
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type QRConfig = z.infer<typeof QRConfigSchema>;
export type ConnectionInfo = z.infer<typeof ConnectionInfoSchema>;
export type CacheKey = z.infer<typeof CacheKeySchema>;
export type EventLog = z.infer<typeof EventLogSchema>;
export type QueueError = z.infer<typeof QueueErrorSchema>;

// Socket Event Payloads
export interface SocketEventPayloads {
  // Client -> Server
  'join-notaria': { notariaId: string; userType?: 'CLIENT' | 'ADMIN' };
  'join-session': { sessionId: string; clientInfo?: any };
  'leave-notaria': { notariaId: string };
  'leave-session': { sessionId: string };
  'heartbeat': { timestamp: number };
  'client-ready': { sessionId: string; timestamp: number };
  'cancel-session': { sessionId: string; reason?: string };
  'request-position': { sessionId: string };
  
  // Server -> Client
  'queue-updated': { 
    notariaId: string;
    sessions: ActiveSession[];
    stats: Partial<QueueStats>;
    timestamp: number;
  };
  'session-ready': { 
    sessionId: string; 
    position: number;
    estimatedCallTime: Date;
    message: string;
  };
  'session-called': { 
    sessionId: string;
    counter?: number;
    message: string;
  };
  'session-expired': { 
    sessionId: string; 
    reason: string;
    canRenew: boolean;
  };
  'session-cancelled': { 
    sessionId: string; 
    reason: string;
    timestamp: Date;
  };
  'position-updated': { 
    sessionId: string; 
    newPosition: number;
    estimatedWaitTime: number;
    changelog: string;
  };
  'wait-time-updated': { 
    sessionId: string;
    newWaitTime: number;
    accuracy: 'low' | 'medium' | 'high';
  };
  'notification': {
    type: NotificationType;
    title: string;
    message: string;
    sessionId?: string;
    data?: any;
    priority: 'low' | 'normal' | 'high';
  };
  'stats-updated': {
    notariaId: string;
    stats: QueueStats;
    timestamp: number;
  };
  'error': {
    code: string;
    message: string;
    details?: any;
    timestamp: Date;
  };
  'reconnected': {
    sessionId?: string;
    notariaId: string;
    missedEvents: any[];
  };
  
  // Admin Events
  'admin-join': { notariaId: string; adminId: string };
  'call-next': { notariaId: string; counter?: number };
  'complete-session': { sessionId: string; duration: number; notes?: string };
  'extend-session': { sessionId: string; additionalMinutes: number };
  'priority-updated': { sessionId: string; newPriority: PriorityLevel; reason?: string };
  'queue-paused': { notariaId: string; reason: string };
  'queue-resumed': { notariaId: string };
}

// Manager Interfaces
export interface IQueueManager {
  addSession(session: Omit<ActiveSession, 'id' | 'position' | 'createdAt' | 'updatedAt'>): Promise<ActiveSession>;
  removeSession(sessionId: string): Promise<boolean>;
  updateSession(sessionId: string, updates: Partial<ActiveSession>): Promise<ActiveSession | null>;
  getSession(sessionId: string): Promise<ActiveSession | null>;
  getQueueByNotaria(notariaId: string): Promise<ActiveSession[]>;
  getPosition(sessionId: string): Promise<number>;
  moveToNext(notariaId: string): Promise<ActiveSession | null>;
  updatePositions(notariaId: string): Promise<void>;
  estimateWaitTime(notariaId: string, position: number): Promise<number>;
  getStats(notariaId: string): Promise<QueueStats>;
  cleanupExpired(notariaId?: string): Promise<number>;
}

export interface ISessionManager {
  createSession(data: Omit<ActiveSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<ActiveSession>;
  activateSession(sessionId: string): Promise<ActiveSession | null>;
  completeSession(sessionId: string, metadata?: any): Promise<ActiveSession | null>;
  expireSession(sessionId: string, reason: string): Promise<ActiveSession | null>;
  extendSession(sessionId: string, additionalMinutes: number): Promise<ActiveSession | null>;
  cancelSession(sessionId: string, reason: string): Promise<ActiveSession | null>;
  getSession(sessionId: string): Promise<ActiveSession | null>;
  getSessionsByStatus(notariaId: string, status: SessionStatus): Promise<ActiveSession[]>;
  isSessionExpired(session: ActiveSession): boolean;
  scheduleExpiration(session: ActiveSession): void;
  cleanupExpiredSessions(notariaId?: string): Promise<number>;
}

export interface ISocketManager {
  initialize(): Promise<void>;
  broadcast(notariaId: string, event: SocketEvent, data: any): void;
  emit(socketId: string, event: SocketEvent, data: any): void;
  join(socketId: string, room: string): void;
  leave(socketId: string, room: string): void;
  getConnectedClients(notariaId: string): ConnectionInfo[];
  disconnect(socketId: string): void;
  handleConnection(socket: any): void;
  handleDisconnection(socketId: string): void;
  sendNotification(sessionId: string, notification: SocketEventPayloads['notification']): void;
  isConnected(socketId: string): boolean;
}

export interface IQRGenerator {
  generateStaticQR(notariaId: string, config?: Partial<QRConfig>): Promise<string>;
  generateSessionQR(sessionId: string, config?: Partial<QRConfig>): Promise<string>;
  getNotariaUrl(notariaId: string): string;
  getSessionUrl(sessionId: string): string;
  validateQRData(data: string): boolean;
  updateQRDesign(notariaId: string, design: Partial<QRConfig>): Promise<void>;
}

// Redis Cache Interface
export interface ICacheManager {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<boolean>;
  exists(key: string): Promise<boolean>;
  keys(pattern: string): Promise<string[]>;
  flushByPattern(pattern: string): Promise<number>;
  increment(key: string, by?: number): Promise<number>;
  expire(key: string, ttlSeconds: number): Promise<boolean>;
}

// Event Logger Interface  
export interface IEventLogger {
  log(event: Omit<EventLog, 'id' | 'timestamp'>): Promise<void>;
  getEvents(notariaId: string, limit?: number): Promise<EventLog[]>;
  getEventsBySession(sessionId: string): Promise<EventLog[]>;
  getEventsByType(event: SocketEvent, notariaId?: string): Promise<EventLog[]>;
  cleanup(olderThanDays: number): Promise<number>;
}

// Configuration Interface
export interface IConfigManager {
  getQueueConfig(notariaId: string): Promise<QueueConfig>;
  updateQueueConfig(notariaId: string, config: Partial<QueueConfig>): Promise<QueueConfig>;
  getNotariaList(): Promise<string[]>;
  isNotariaActive(notariaId: string): Promise<boolean>;
  getGlobalConfig(): Promise<any>;
  updateGlobalConfig(config: any): Promise<void>;
}

// Main Service Interface
export interface ISessionQueueService {
  queueManager: IQueueManager;
  sessionManager: ISessionManager;
  socketManager: ISocketManager;
  qrGenerator: IQRGenerator;
  cacheManager?: ICacheManager;
  eventLogger?: IEventLogger;
  configManager: IConfigManager;
  
  start(): Promise<void>;
  stop(): Promise<void>;
  restart(): Promise<void>;
  healthCheck(): Promise<{ status: string; services: Record<string, string> }>;
}

// Utility Types
export type SessionUpdate = Partial<Pick<ActiveSession, 'status' | 'priority' | 'clientName' | 'tramiteType' | 'metadata'>>;
export type QueueFilter = Partial<Pick<ActiveSession, 'status' | 'tramiteType' | 'priority' | 'notariaId'>>;
export type QueueSort = {
  field: keyof ActiveSession;
  direction: 'asc' | 'desc';
};

// Constants
export const QUEUE_EVENTS = {
  SESSION_CREATED: 'session.created',
  SESSION_UPDATED: 'session.updated',
  SESSION_READY: 'session.ready',
  SESSION_CALLED: 'session.called',
  SESSION_COMPLETED: 'session.completed',
  SESSION_EXPIRED: 'session.expired',
  SESSION_CANCELLED: 'session.cancelled',
  QUEUE_UPDATED: 'queue.updated',
  POSITION_UPDATED: 'position.updated',
  STATS_UPDATED: 'stats.updated'
} as const;

export const CACHE_KEYS = {
  QUEUE: (notariaId: string) => `queue:${notariaId}`,
  SESSION: (sessionId: string) => `session:${sessionId}`,
  STATS: (notariaId: string) => `stats:${notariaId}`,
  CONFIG: (notariaId: string) => `config:${notariaId}`,
  QR: (notariaId: string) => `qr:${notariaId}`,
  CONNECTIONS: (notariaId: string) => `connections:${notariaId}`
} as const;