import { QueueConfig } from '../types';

// Default queue configurations
export const DEFAULT_QUEUE_CONFIGS: Record<string, QueueConfig> = {
  'NOTARIA_18_QUITO': {
    notariaId: 'NOTARIA_18_QUITO',
    maxConcurrentSessions: 8,
    sessionTimeoutMinutes: 150, // 2.5 hours
    readyTimeoutMinutes: 20,    // 20 minutes to respond
    estimatedTimePerTramite: 18, // 18 minutes average
    enablePriorities: true,
    autoExpireInactive: true,
    notificationSettings: {
      enablePush: true,
      enableSound: true,
      reminderMinutes: [10, 5, 2] // More reminders for busy notaría
    }
  },
  'NOTARIA_01_GUAYAQUIL': {
    notariaId: 'NOTARIA_01_GUAYAQUIL',
    maxConcurrentSessions: 6,
    sessionTimeoutMinutes: 120,
    readyTimeoutMinutes: 15,
    estimatedTimePerTramite: 22,
    enablePriorities: true,
    autoExpireInactive: true,
    notificationSettings: {
      enablePush: true,
      enableSound: true,
      reminderMinutes: [5, 2]
    }
  },
  'NOTARIA_05_CUENCA': {
    notariaId: 'NOTARIA_05_CUENCA',
    maxConcurrentSessions: 4,
    sessionTimeoutMinutes: 180, // 3 hours - smaller city, more flexible
    readyTimeoutMinutes: 25,
    estimatedTimePerTramite: 25,
    enablePriorities: true,
    autoExpireInactive: true,
    notificationSettings: {
      enablePush: true,
      enableSound: false, // Quieter environment
      reminderMinutes: [10, 3]
    }
  },
  'DEFAULT': {
    notariaId: 'DEFAULT',
    maxConcurrentSessions: 5,
    sessionTimeoutMinutes: 120,
    readyTimeoutMinutes: 15,
    estimatedTimePerTramite: 20,
    enablePriorities: true,
    autoExpireInactive: true,
    notificationSettings: {
      enablePush: true,
      enableSound: true,
      reminderMinutes: [5, 2]
    }
  }
};

// Environment-based configuration
export const SESSION_QUEUE_CONFIG = {
  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'notarial:queue:',
    retryDelayOnFailover: 1000,
    maxRetriesPerRequest: 3
  },

  // Socket.io configuration
  socketio: {
    port: parseInt(process.env.SOCKETIO_PORT || '3001'),
    cors: {
      origin: process.env.CORS_ORIGINS?.split(',') || [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://notaria18.com'
      ],
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  },

  // Queue processing settings
  processing: {
    cleanupIntervalMinutes: 5,
    batchSize: 50,
    maxRetries: 3,
    deadLetterTtlHours: 24,
    enableMetrics: true,
    metricsIntervalMinutes: 1
  },

  // QR code generation
  qr: {
    outputDir: process.env.QR_OUTPUT_DIR || './public/qr-codes',
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    defaultSize: 250,
    cacheEnabled: true,
    cacheTtlHours: 24
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: process.env.NODE_ENV !== 'production',
    enableFile: true,
    logDir: process.env.LOG_DIR || './logs',
    maxFiles: 10,
    maxSize: '10m'
  },

  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/notarial_forms',
    enableSsl: process.env.NODE_ENV === 'production',
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10'),
    connectionTimeout: 30000
  },

  // Feature flags
  features: {
    enablePriorities: process.env.ENABLE_PRIORITIES !== 'false',
    enableNotifications: process.env.ENABLE_NOTIFICATIONS !== 'false',
    enableAnalytics: process.env.ENABLE_ANALYTICS !== 'false',
    enableQRGeneration: process.env.ENABLE_QR_GENERATION !== 'false',
    enableWebhooks: process.env.ENABLE_WEBHOOKS === 'true'
  },

  // Performance settings
  performance: {
    maxConnectionsPerNotaria: 100,
    rateLimitPerMinute: 60,
    maxQueueLength: 500,
    memoryThresholdMB: 512,
    cpuThresholdPercent: 80
  }
};

// Tramite type configurations
export const TRAMITE_CONFIGS = {
  VEHICULO: {
    estimatedTimeMinutes: 15,
    requiredFields: ['comprador', 'vendedor', 'placa', 'motor'],
    priority: 'NORMAL',
    notifications: ['SMS', 'EMAIL']
  },
  COMPRAVENTA: {
    estimatedTimeMinutes: 25,
    requiredFields: ['comprador', 'vendedor', 'valorOperacion'],
    priority: 'NORMAL',
    notifications: ['EMAIL']
  },
  DONACION: {
    estimatedTimeMinutes: 20,
    requiredFields: ['donante', 'donatario'],
    priority: 'NORMAL',
    notifications: ['EMAIL']
  },
  CONSTITUCION_SOCIEDAD: {
    estimatedTimeMinutes: 45,
    requiredFields: ['denominacion', 'socios', 'capital'],
    priority: 'HIGH',
    notifications: ['EMAIL', 'SMS']
  },
  FIDEICOMISO: {
    estimatedTimeMinutes: 35,
    requiredFields: ['fideicomitente', 'fiduciario'],
    priority: 'HIGH',
    notifications: ['EMAIL']
  },
  DILIGENCIA: {
    estimatedTimeMinutes: 20,
    requiredFields: ['solicitante'],
    priority: 'LOW',
    notifications: ['EMAIL']
  },
  PODER: {
    estimatedTimeMinutes: 15,
    requiredFields: ['poderdante', 'apoderado'],
    priority: 'NORMAL',
    notifications: ['EMAIL']
  },
  TESTAMENTO: {
    estimatedTimeMinutes: 40,
    requiredFields: ['testador'],
    priority: 'HIGH',
    notifications: ['EMAIL', 'SMS']
  }
};

// Notification templates
export const NOTIFICATION_TEMPLATES = {
  SESSION_READY: {
    title: '🔔 Tu turno está listo',
    message: 'Hola {clientName}, tu turno para {tramiteType} está listo. Tienes {timeLimit} minutos para responder.',
    sound: 'notification.mp3',
    vibrate: [200, 100, 200]
  },
  SESSION_CALLED: {
    title: '📢 Estás siendo llamado',
    message: 'Por favor dirígete al counter {counter} para tu trámite de {tramiteType}.',
    sound: 'call.mp3',
    vibrate: [400, 200, 400, 200, 400]
  },
  POSITION_UPDATE: {
    title: '📍 Actualización de posición',
    message: 'Tu posición actual es {position}. Tiempo estimado: {waitTime} minutos.',
    sound: null,
    vibrate: [100]
  },
  SESSION_EXPIRING: {
    title: '⏰ Tu sesión está por expirar',
    message: 'Tu sesión expira en {minutes} minutos. ¿Deseas extenderla?',
    sound: 'warning.mp3',
    vibrate: [300, 100, 300]
  },
  SESSION_EXPIRED: {
    title: '❌ Sesión expirada',
    message: 'Tu sesión ha expirado por {reason}. Puedes crear una nueva sesión si es necesario.',
    sound: 'error.mp3',
    vibrate: [500, 200, 500]
  },
  QUEUE_PAUSED: {
    title: '⏸️ Cola pausada',
    message: 'La atención ha sido pausada temporalmente. Te notificaremos cuando se reanude.',
    sound: 'pause.mp3',
    vibrate: [200, 100, 200]
  },
  QUEUE_RESUMED: {
    title: '▶️ Cola reanudada',
    message: 'La atención ha sido reanudada. Tu posición actual es {position}.',
    sound: 'resume.mp3',
    vibrate: [200]
  }
};

// Socket.io event configurations
export const SOCKET_EVENTS_CONFIG = {
  // Rate limiting per event
  rateLimits: {
    'join-notaria': { maxPerMinute: 10, burst: 3 },
    'join-session': { maxPerMinute: 5, burst: 2 },
    'heartbeat': { maxPerMinute: 120, burst: 10 },
    'request-position': { maxPerMinute: 20, burst: 5 },
    'cancel-session': { maxPerMinute: 2, burst: 1 }
  },

  // Event validation schemas
  validation: {
    'join-notaria': {
      required: ['notariaId'],
      optional: ['userType', 'metadata']
    },
    'join-session': {
      required: ['sessionId'],
      optional: ['clientInfo']
    },
    'cancel-session': {
      required: ['sessionId'],
      optional: ['reason']
    }
  },

  // Broadcasting rules
  broadcast: {
    'queue-updated': {
      rooms: ['notaria', 'admin'],
      throttleMs: 1000 // Max once per second
    },
    'session-ready': {
      rooms: ['session', 'admin'],
      throttleMs: 0
    },
    'stats-updated': {
      rooms: ['admin'],
      throttleMs: 5000 // Max once per 5 seconds
    }
  }
};

// Development/testing overrides
if (process.env.NODE_ENV === 'development') {
  // Shorter timeouts for development
  Object.keys(DEFAULT_QUEUE_CONFIGS).forEach(key => {
    DEFAULT_QUEUE_CONFIGS[key].sessionTimeoutMinutes = 30; // 30 minutes
    DEFAULT_QUEUE_CONFIGS[key].readyTimeoutMinutes = 5;    // 5 minutes
  });
}

// Production optimizations
if (process.env.NODE_ENV === 'production') {
  // Disable console logging in production
  SESSION_QUEUE_CONFIG.logging.enableConsole = false;
  
  // Enable SSL for database
  SESSION_QUEUE_CONFIG.database.enableSsl = true;
  
  // Stricter rate limiting
  SESSION_QUEUE_CONFIG.performance.rateLimitPerMinute = 30;
}