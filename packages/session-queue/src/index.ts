// Main service export
export { SessionQueueService } from './SessionQueueService';

// Manager exports
export { QueueManager } from './managers/QueueManager';
export { SessionManager } from './managers/SessionManager';
export { SocketManager } from './managers/SocketManager';
export { QRGenerator } from './managers/QRGenerator';
export { ConfigManager } from './managers/ConfigManager';

// Utility exports
export { CacheManager } from './utils/CacheManager';
export { EventLogger } from './utils/EventLogger';

// Type exports
export * from './types';

// Configuration exports
export * from './config';

// Events and constants
export { QUEUE_EVENTS, CACHE_KEYS } from './types';

// Default configurations
export { 
  DEFAULT_QUEUE_CONFIGS, 
  SESSION_QUEUE_CONFIG,
  TRAMITE_CONFIGS,
  NOTIFICATION_TEMPLATES,
  SOCKET_EVENTS_CONFIG
} from './config';

// Factory functions for easy setup
export const createSessionQueueService = () => {
  return new SessionQueueService();
};

// Validation helpers
export const validateNotariaId = (notariaId: string): boolean => {
  return /^NOTARIA_\d+_[A-Z]+$/.test(notariaId);
};

export const validateSessionId = (sessionId: string): boolean => {
  return /^ses_\d+_[a-f0-9]{8}$/.test(sessionId);
};

export const validateTramiteType = (tramiteType: string): boolean => {
  const validTypes = [
    'COMPRAVENTA', 'DONACION', 'CONSTITUCION_SOCIEDAD', 
    'FIDEICOMISO', 'CONSORCIO', 'VEHICULO', 'DILIGENCIA',
    'HIPOTECA', 'PODER', 'TESTAMENTO', 'OTRO'
  ];
  return validTypes.includes(tramiteType);
};

// Utility functions for queue operations
export const estimateQueueTime = (
  position: number, 
  averageTimePerTramite: number = 20
): number => {
  return Math.max(0, (position - 1) * averageTimePerTramite);
};

export const calculateExpirationTime = (
  timeoutMinutes: number = 120
): Date => {
  return new Date(Date.now() + timeoutMinutes * 60 * 1000);
};

export const formatWaitTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)} minutos`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (mins === 0) {
    return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  
  return `${hours}h ${mins}min`;
};

export const getQueuePosition = (
  sessions: any[], 
  sessionId: string
): number => {
  const index = sessions.findIndex(session => session.id === sessionId);
  return index >= 0 ? index + 1 : -1;
};

// Priority helpers
export const getPriorityWeight = (priority: string): number => {
  const weights = { CRITICAL: 10, HIGH: 8, NORMAL: 5, LOW: 2 };
  return weights[priority as keyof typeof weights] || 5;
};

export const sortByPriority = (sessions: any[]): any[] => {
  return [...sessions].sort((a, b) => {
    const weightA = getPriorityWeight(a.priority);
    const weightB = getPriorityWeight(b.priority);
    
    if (weightA !== weightB) {
      return weightB - weightA; // Higher priority first
    }
    
    // Same priority, sort by creation time (FIFO)
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
};

// QR Code helpers
export const generateQRUrl = (
  baseUrl: string, 
  notariaId: string
): string => {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  return `${cleanBaseUrl}/queue/${notariaId}`;
};

export const generateSessionUrl = (
  baseUrl: string, 
  sessionId: string
): string => {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  return `${cleanBaseUrl}/session/${sessionId}`;
};

// Socket.io client helpers for frontend integration
export const createSocketClient = (
  serverUrl: string,
  options: any = {}
) => {
  // This would typically import socket.io-client
  // For now, return configuration object
  return {
    url: serverUrl,
    options: {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: 5,
      ...options
    }
  };
};

// Event emitter for custom integrations
export class QueueEventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  off(event: string, callback?: Function): void {
    if (!callback) {
      this.listeners.delete(event);
      return;
    }

    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  removeAllListeners(): void {
    this.listeners.clear();
  }
}

// Health check helpers
export const createHealthChecker = (service: SessionQueueService) => {
  return {
    async check(): Promise<{
      status: 'healthy' | 'unhealthy' | 'degraded';
      timestamp: string;
      services: Record<string, string>;
      uptime: number;
    }> {
      const startTime = process.uptime();
      const healthResult = await service.healthCheck();
      
      return {
        ...healthResult,
        timestamp: new Date().toISOString(),
        uptime: startTime
      };
    },

    async isHealthy(): Promise<boolean> {
      try {
        const health = await this.check();
        return health.status === 'healthy';
      } catch {
        return false;
      }
    }
  };
};

// Performance monitoring helpers
export const createPerformanceMonitor = () => {
  const metrics = new Map<string, number[]>();

  return {
    recordMetric(name: string, value: number): void {
      if (!metrics.has(name)) {
        metrics.set(name, []);
      }
      
      const values = metrics.get(name)!;
      values.push(value);
      
      // Keep only last 100 values
      if (values.length > 100) {
        values.shift();
      }
    },

    getMetrics(): Record<string, {
      avg: number;
      min: number;
      max: number;
      count: number;
    }> {
      const result: Record<string, any> = {};
      
      metrics.forEach((values, name) => {
        if (values.length > 0) {
          result[name] = {
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            min: Math.min(...values),
            max: Math.max(...values),
            count: values.length
          };
        }
      });
      
      return result;
    },

    clearMetrics(): void {
      metrics.clear();
    }
  };
};