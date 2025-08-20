# Session Queue - Sistema de Cola en Tiempo Real

Sistema completo de gestión de colas para trámites notariales con Socket.io, QR codes estáticos, y funcionalidades en tiempo real.

## Características Principales

### 🔄 **Cola Inteligente con Prioridades**
- Gestión FIFO con sistema de prioridades (LOW, NORMAL, HIGH, CRITICAL)
- Cálculo automático de posiciones y tiempos de espera
- Manejo de múltiples trámites simultáneos por notaría
- Limpieza automática de sesiones expiradas

### 🌐 **Real-Time con Socket.io**
- WebSocket server completo con broadcasting automático
- Eventos: `queue-updated`, `session-ready`, `session-called`, `session-expired`
- Reconnection handling y heartbeat monitoring
- Broadcasting a todos los clientes conectados

### 📱 **QR Codes Estáticos**
- Generación automática de códigos QR por notaría
- Acceso directo sin necesidad de URLs dinámicas
- Personalización por notaría (colores, logos, información)
- Cache inteligente para optimización

### ⏰ **Gestión de Sesiones**
- Lifecycle completo: creación → activación → expiración/completado
- Expiración automática de sesiones inactivas
- Extensión manual de tiempo por administradores
- Notificaciones push cuando el turno está listo

### 🎯 **Arquitectura Modular**
- **QueueManager**: Gestión de cola FIFO con prioridades
- **SessionManager**: Lifecycle de sesiones y expiración automática
- **SocketManager**: WebSocket events y broadcasting
- **QRGenerator**: Generación de códigos QR estáticos/dinámicos

## Instalación

```bash
# Instalar dependencias
npm install

# Build el package
npm run build

# Modo desarrollo
npm run dev
```

## Configuración

### Variables de Entorno

```env
# Redis (opcional para cache)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Socket.io
SOCKETIO_PORT=3001
CORS_ORIGINS=http://localhost:3000,https://notaria18.com

# Base URL para QR codes
BASE_URL=https://notaria18.com

# Database
DATABASE_URL=postgresql://localhost:5432/notarial_forms

# Logging
LOG_LEVEL=info
LOG_DIR=./logs

# Features
ENABLE_PRIORITIES=true
ENABLE_NOTIFICATIONS=true
ENABLE_QR_GENERATION=true
```

### Configuración por Notaría

```typescript
import { DEFAULT_QUEUE_CONFIGS } from '@notarial-forms/session-queue';

// Personalizar configuración para NOTARIA_18_QUITO
DEFAULT_QUEUE_CONFIGS['NOTARIA_18_QUITO'] = {
  notariaId: 'NOTARIA_18_QUITO',
  maxConcurrentSessions: 8,
  sessionTimeoutMinutes: 150, // 2.5 horas
  readyTimeoutMinutes: 20,    // 20 minutos para responder
  estimatedTimePerTramite: 18,
  enablePriorities: true,
  autoExpireInactive: true,
  notificationSettings: {
    enablePush: true,
    enableSound: true,
    reminderMinutes: [10, 5, 2] // Recordatorios
  }
};
```

## Uso Básico

### Inicializar el Servicio

```typescript
import { SessionQueueService } from '@notarial-forms/session-queue';

const queueService = new SessionQueueService();

// Iniciar servicio
await queueService.start();

// Health check
const health = await queueService.healthCheck();
console.log('Service status:', health.status);

// Parar servicio
await queueService.stop();
```

### Cliente Socket.io (Frontend)

```typescript
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3001');

// Unirse a notaría
socket.emit('join-notaria', {
  notariaId: 'NOTARIA_18_QUITO',
  userType: 'CLIENT'
});

// Crear nueva sesión
socket.emit('create-session', {
  documentId: 'doc_abc123',
  clientName: 'JUAN MARTINEZ',
  tramiteType: 'VEHICULO',
  notariaId: 'NOTARIA_18_QUITO',
  priority: 'NORMAL'
});

// Escuchar actualizaciones de cola
socket.on('queue-updated', (data) => {
  console.log('Queue updated:', data.sessions);
  console.log('Stats:', data.stats);
});

// Escuchar cuando el turno está listo
socket.on('session-ready', (data) => {
  console.log(`Tu turno está listo! Posición: ${data.position}`);
  // Mostrar notificación al usuario
});

// Escuchar llamadas
socket.on('session-called', (data) => {
  console.log(`Estás siendo llamado al counter!`);
  // Reproducir sonido, vibrar, etc.
});
```

### Administración (Panel Admin)

```typescript
// Unirse como admin
socket.emit('admin-join', {
  notariaId: 'NOTARIA_18_QUITO',
  adminId: 'admin_123'
});

// Llamar siguiente en cola
socket.emit('admin-call-next', {
  notariaId: 'NOTARIA_18_QUITO'
});

// Obtener estadísticas
socket.emit('admin-get-stats', {
  notariaId: 'NOTARIA_18_QUITO'
});

// Pausar cola
socket.emit('admin-pause-queue', {
  notariaId: 'NOTARIA_18_QUITO',
  reason: 'Pausa para almuerzo'
});
```

## API de Managers

### QueueManager

```typescript
import { QueueManager } from '@notarial-forms/session-queue';

const queueManager = new QueueManager(prisma, logger, cache);

// Agregar sesión a cola
const session = await queueManager.addSession({
  documentId: 'doc_123',
  notariaId: 'NOTARIA_18_QUITO',
  clientName: 'MARIA RODRIGUEZ',
  tramiteType: 'COMPRAVENTA',
  priority: 'HIGH',
  // ... otros campos
});

// Obtener cola de notaría
const queue = await queueManager.getQueueByNotaria('NOTARIA_18_QUITO');

// Obtener posición de sesión
const position = await queueManager.getPosition('ses_123_abc');

// Mover siguiente en cola
const nextSession = await queueManager.moveToNext('NOTARIA_18_QUITO');

// Estadísticas
const stats = await queueManager.getStats('NOTARIA_18_QUITO');
console.log(`Sesiones esperando: ${stats.waitingSessions}`);
console.log(`Tiempo promedio espera: ${stats.averageWaitTime} min`);
```

### SessionManager

```typescript
import { SessionManager } from '@notarial-forms/session-queue';

const sessionManager = new SessionManager(prisma, logger, cache, socketManager);

// Crear sesión
const session = await sessionManager.createSession({
  documentId: 'doc_123',
  notariaId: 'NOTARIA_18_QUITO',
  clientName: 'CARLOS LOPEZ',
  tramiteType: 'VEHICULO',
  priority: 'NORMAL',
  status: 'WAITING',
  position: 1,
  estimatedWaitTime: 20,
  expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 horas
});

// Activar sesión (cuando es llamada)
const activeSession = await sessionManager.activateSession('ses_123_abc');

// Completar sesión
const completed = await sessionManager.completeSession('ses_123_abc', {
  notes: 'Trámite completado exitosamente',
  duration: 15 // minutos
});

// Extender tiempo de sesión
const extended = await sessionManager.extendSession('ses_123_abc', 30); // +30 min

// Cancelar sesión
const cancelled = await sessionManager.cancelSession('ses_123_abc', 'Cliente no se presentó');

// Cleanup automático
const expired = await sessionManager.cleanupExpiredSessions();
```

### QRGenerator

```typescript
import { QRGenerator } from '@notarial-forms/session-queue';

const qrGenerator = new QRGenerator(
  'https://notaria18.com', // Base URL
  logger,
  './qr-codes', // Output directory
  cache
);

// Generar QR estático para notaría
const qrDataUrl = await qrGenerator.generateStaticQR('NOTARIA_18_QUITO', {
  size: 300,
  darkColor: '#1a365d',
  lightColor: '#ffffff',
  customData: {
    name: 'Notaría Décima Octava',
    address: 'Av. 6 de Diciembre, Quito',
    phone: '(02) 2504-567'
  }
});

// Generar QR para sesión específica
const sessionQR = await qrGenerator.generateSessionQR('ses_123_abc');

// Generar múltiples QRs
const batchQRs = await qrGenerator.generateBatchQRs([
  'NOTARIA_18_QUITO',
  'NOTARIA_01_GUAYAQUIL'
]);

// Estadísticas
const stats = await qrGenerator.getQRStats();
console.log(`QRs generados: ${stats.totalGenerated}`);
console.log(`Cache hit rate: ${stats.cacheHitRate * 100}%`);
```

## Eventos Socket.io

### Cliente → Servidor

| Evento | Descripción | Datos |
|--------|-------------|-------|
| `join-notaria` | Unirse a notaría | `{ notariaId, userType }` |
| `join-session` | Unirse a sesión específica | `{ sessionId, clientInfo }` |
| `create-session` | Crear nueva sesión | `{ documentId, clientName, tramiteType, notariaId, priority }` |
| `heartbeat` | Mantener conexión activa | `{ timestamp }` |
| `client-ready` | Cliente listo para ser atendido | `{ sessionId }` |
| `cancel-session` | Cancelar sesión | `{ sessionId, reason }` |
| `request-position` | Solicitar posición actual | `{ sessionId }` |

### Servidor → Cliente

| Evento | Descripción | Datos |
|--------|-------------|-------|
| `queue-updated` | Cola actualizada | `{ notariaId, sessions, stats }` |
| `session-ready` | Sesión lista para ser llamada | `{ sessionId, position, estimatedCallTime }` |
| `session-called` | Sesión siendo llamada | `{ sessionId, counter, message }` |
| `session-expired` | Sesión expirada | `{ sessionId, reason, canRenew }` |
| `position-updated` | Posición actualizada | `{ sessionId, newPosition, estimatedWaitTime }` |
| `notification` | Notificación general | `{ type, title, message, priority }` |
| `stats-updated` | Estadísticas actualizadas | `{ notariaId, stats }` |

### Eventos de Administración

| Evento | Descripción | Datos |
|--------|-------------|-------|
| `admin-join` | Admin se une a notaría | `{ notariaId, adminId }` |
| `admin-call-next` | Llamar siguiente en cola | `{ notariaId }` |
| `admin-get-stats` | Obtener estadísticas | `{ notariaId }` |
| `admin-pause-queue` | Pausar cola | `{ notariaId, reason }` |
| `admin-resume-queue` | Reanudar cola | `{ notariaId }` |

## Integración con React

### Hook personalizado

```typescript
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSessionQueue = (notariaId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('ws://localhost:3001');
    
    newSocket.on('connect', () => {
      setConnected(true);
      newSocket.emit('join-notaria', { notariaId, userType: 'CLIENT' });
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('queue-updated', (data) => {
      setQueue(data.sessions);
      setStats(data.stats);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [notariaId]);

  const createSession = (sessionData: any) => {
    if (socket) {
      socket.emit('create-session', {
        ...sessionData,
        notariaId
      });
    }
  };

  const cancelSession = (sessionId: string, reason: string) => {
    if (socket) {
      socket.emit('cancel-session', { sessionId, reason });
    }
  };

  return {
    socket,
    queue,
    stats,
    connected,
    createSession,
    cancelSession
  };
};
```

### Componente de Cola

```tsx
import React from 'react';
import { useSessionQueue } from './hooks/useSessionQueue';

interface QueueDisplayProps {
  notariaId: string;
}

export const QueueDisplay: React.FC<QueueDisplayProps> = ({ notariaId }) => {
  const { queue, stats, connected, createSession } = useSessionQueue(notariaId);

  const handleCreateSession = () => {
    createSession({
      documentId: 'doc_123',
      clientName: 'JUAN PEREZ',
      tramiteType: 'VEHICULO',
      priority: 'NORMAL'
    });
  };

  return (
    <div className="queue-display">
      <div className="connection-status">
        Status: {connected ? '🟢 Conectado' : '🔴 Desconectado'}
      </div>

      <div className="stats">
        {stats && (
          <>
            <div>Esperando: {stats.waitingSessions}</div>
            <div>Activos: {stats.activeSessions}</div>
            <div>Tiempo promedio: {stats.averageWaitTime} min</div>
          </>
        )}
      </div>

      <div className="queue-list">
        <h3>Cola Actual</h3>
        {queue.map((session, index) => (
          <div key={session.id} className="queue-item">
            <span className="position">#{index + 1}</span>
            <span className="client">{session.clientName}</span>
            <span className="tramite">{session.tramiteType}</span>
            <span className="status">{session.status}</span>
            <span className="wait-time">{session.estimatedWaitTime} min</span>
          </div>
        ))}
      </div>

      <button onClick={handleCreateSession}>
        Crear Nueva Sesión
      </button>
    </div>
  );
};
```

## Notificaciones

### Configuración de Notificaciones

```typescript
import { NOTIFICATION_TEMPLATES } from '@notarial-forms/session-queue';

// Personalizar templates
NOTIFICATION_TEMPLATES.SESSION_READY = {
  title: '🔔 Tu turno está listo',
  message: 'Hola {clientName}, tu turno para {tramiteType} está listo. Tienes {timeLimit} minutos para responder.',
  sound: 'custom-notification.mp3',
  vibrate: [200, 100, 200, 100, 200]
};

// Configurar por notaría
const queueConfig = {
  notariaId: 'NOTARIA_18_QUITO',
  notificationSettings: {
    enablePush: true,
    enableSound: true,
    reminderMinutes: [10, 5, 2, 1] // Recordatorios más frecuentes
  }
};
```

### Manejo de Notificaciones en Frontend

```typescript
// Solicitar permisos de notificación
const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

// Escuchar notificaciones del socket
socket.on('notification', (data) => {
  const { type, title, message, priority } = data;
  
  // Mostrar notificación del navegador
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/notaria-icon.png',
      tag: `session-${data.sessionId}`,
      requireInteraction: priority === 'high'
    });
  }

  // Reproducir sonido
  if (data.sound) {
    const audio = new Audio(`/sounds/${data.sound}`);
    audio.play().catch(console.error);
  }

  // Vibrar (móvil)
  if (navigator.vibrate && data.vibrate) {
    navigator.vibrate(data.vibrate);
  }
});
```

## Monitoreo y Analytics

### Métricas en Tiempo Real

```typescript
// Obtener estadísticas detalladas
const stats = await queueManager.getStats('NOTARIA_18_QUITO');

console.log('Estadísticas de Cola:', {
  totalSesiones: stats.totalSessions,
  esperando: stats.waitingSessions,
  activas: stats.activeSessions,
  completadasHoy: stats.completedToday,
  tiempoPromedioEspera: stats.averageWaitTime,
  tiempoPromedioServicio: stats.averageServiceTime,
  distribucionTramites: stats.tramiteTypeDistribution,
  horasPico: stats.peakHours
});

// Event logging
const eventStats = await eventLogger.getStats('NOTARIA_18_QUITO', 24);
console.log('Eventos (24h):', {
  totalEventos: eventStats.totalEvents,
  eventosPorTipo: eventStats.eventsByType,
  tasaError: eventStats.errorRate
});
```

### Health Monitoring

```typescript
import { createHealthChecker } from '@notarial-forms/session-queue';

const healthChecker = createHealthChecker(queueService);

// Check periódico
setInterval(async () => {
  const health = await healthChecker.check();
  
  if (health.status !== 'healthy') {
    console.warn('Service degraded:', health.services);
    // Enviar alerta, restart automático, etc.
  }
}, 30000); // Cada 30 segundos
```

## Escalabilidad

### Configuración para Múltiples Instancias

```typescript
// Redis para estado compartido
const cacheManager = new CacheManager(logger, {
  host: 'redis-cluster.example.com',
  port: 6379,
  password: 'secure-password',
  keyPrefix: 'notarial:queue:'
});

// Load balancer setup
const service1 = new SessionQueueService();
const service2 = new SessionQueueService();

// Sticky sessions por notaría
const loadBalancer = {
  'NOTARIA_18_QUITO': service1,
  'NOTARIA_01_GUAYAQUIL': service2
};
```

### Horizontal Scaling

```yaml
# docker-compose.yml
version: '3.8'
services:
  session-queue-1:
    build: .
    environment:
      - REDIS_HOST=redis
      - SOCKETIO_PORT=3001
    ports:
      - "3001:3001"
      
  session-queue-2:
    build: .
    environment:
      - REDIS_HOST=redis
      - SOCKETIO_PORT=3002
    ports:
      - "3002:3002"
      
  redis:
    image: redis:alpine
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
      
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

## Testing

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { SessionQueueService } from '@notarial-forms/session-queue';

describe('SessionQueueService', () => {
  let service: SessionQueueService;

  beforeEach(async () => {
    service = new SessionQueueService();
    await service.start();
  });

  afterEach(async () => {
    await service.stop();
  });

  it('should create and manage sessions', async () => {
    // Crear sesión
    const session = await service.sessionManager.createSession({
      documentId: 'test_doc',
      notariaId: 'TEST_NOTARIA',
      clientName: 'Test Client',
      tramiteType: 'VEHICULO',
      priority: 'NORMAL',
      status: 'WAITING',
      position: 1,
      estimatedWaitTime: 20,
      expiresAt: new Date(Date.now() + 60000)
    });

    expect(session).toBeDefined();
    expect(session.clientName).toBe('Test Client');

    // Verificar cola
    const queue = await service.queueManager.getQueueByNotaria('TEST_NOTARIA');
    expect(queue).toHaveLength(1);
    expect(queue[0].id).toBe(session.id);
  });

  it('should handle session expiration', async () => {
    // Crear sesión con expiración corta
    const session = await service.sessionManager.createSession({
      // ... datos de sesión
      expiresAt: new Date(Date.now() + 100) // 100ms
    });

    // Esperar expiración
    await new Promise(resolve => setTimeout(resolve, 200));

    // Verificar cleanup
    const expiredCount = await service.sessionManager.cleanupExpiredSessions();
    expect(expiredCount).toBeGreaterThan(0);
  });
});
```

## Licencia

MIT License - Ver archivo LICENSE para más detalles.

## Soporte

Para reportar issues o solicitar features:
- GitHub Issues: https://github.com/notarial-forms/monorepo/issues
- Email: soporte@notaria18.com
- Documentación: https://docs.notaria18.com/session-queue