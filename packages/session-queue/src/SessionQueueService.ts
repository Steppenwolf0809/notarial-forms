import { Server as SocketIOServer } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import { PrismaClient } from '@prisma/client';
import winston from 'winston';
import cron from 'node-cron';
import {
  ISessionQueueService,
  IQueueManager,
  ISessionManager,
  ISocketManager,
  IQRGenerator,
  ICacheManager,
  IEventLogger,
  IConfigManager,
  ActiveSession,
  SocketEventPayloads,
  QUEUE_EVENTS
} from './types';

// Import managers
import { QueueManager } from './managers/QueueManager';
import { SessionManager } from './managers/SessionManager';
import { SocketManager } from './managers/SocketManager';
import { QRGenerator } from './managers/QRGenerator';
import { CacheManager } from './utils/CacheManager';
import { EventLogger } from './utils/EventLogger';
import { ConfigManager } from './managers/ConfigManager';

// Import configuration
import { SESSION_QUEUE_CONFIG, DEFAULT_QUEUE_CONFIGS } from './config';

export class SessionQueueService implements ISessionQueueService {
  // Core dependencies
  private prisma: PrismaClient;
  private logger: winston.Logger;
  private httpServer: HttpServer;
  private io: SocketIOServer;

  // Managers
  public queueManager: IQueueManager;
  public sessionManager: ISessionManager;
  public socketManager: ISocketManager;
  public qrGenerator: IQRGenerator;
  public cacheManager?: ICacheManager;
  public eventLogger?: IEventLogger;
  public configManager: IConfigManager;

  // Service state
  private isRunning: boolean = false;
  private cleanupCron?: cron.ScheduledTask;

  constructor() {
    // Initialize logger
    this.logger = this.createLogger();

    // Initialize Prisma
    this.prisma = new PrismaClient({
      log: SESSION_QUEUE_CONFIG.logging.level === 'debug' 
        ? ['query', 'info', 'warn', 'error'] 
        : ['info', 'warn', 'error']
    });

    // Initialize HTTP server
    this.httpServer = createServer();

    // Initialize Socket.io server
    this.io = new SocketIOServer(this.httpServer, {
      cors: SESSION_QUEUE_CONFIG.socketio.cors,
      transports: SESSION_QUEUE_CONFIG.socketio.transports,
      pingTimeout: SESSION_QUEUE_CONFIG.socketio.pingTimeout,
      pingInterval: SESSION_QUEUE_CONFIG.socketio.pingInterval
    });

    // Initialize managers
    this.initializeManagers();
  }

  /**
   * Start the session queue service
   */
  async start(): Promise<void> {
    try {
      this.logger.info('Starting Session Queue Service...');

      // Connect to database
      await this.prisma.$connect();
      this.logger.info('Database connected');

      // Initialize cache if enabled
      if (this.cacheManager) {
        this.logger.info('Cache initialized');
      }

      // Initialize Socket.io
      await this.socketManager.initialize();
      this.setupSocketEventHandlers();

      // Start HTTP server
      const port = SESSION_QUEUE_CONFIG.socketio.port;
      await new Promise<void>((resolve) => {
        this.httpServer.listen(port, () => {
          this.logger.info(`Socket.io server started on port ${port}`);
          resolve();
        });
      });

      // Start background jobs
      this.startBackgroundJobs();

      // Pregenerate popular QR codes
      if (SESSION_QUEUE_CONFIG.features.enableQRGeneration) {
        await this.qrGenerator.pregeneratePopularQRs();
      }

      this.isRunning = true;
      this.logger.info('Session Queue Service started successfully');

    } catch (error) {
      this.logger.error('Failed to start Session Queue Service', {
        error: error instanceof Error ? error.message : error
      });
      throw error;
    }
  }

  /**
   * Stop the session queue service
   */
  async stop(): Promise<void> {
    try {
      this.logger.info('Stopping Session Queue Service...');
      this.isRunning = false;

      // Stop background jobs
      if (this.cleanupCron) {
        this.cleanupCron.stop();
      }

      // Close Socket.io server
      this.io.close();

      // Close HTTP server
      await new Promise<void>((resolve) => {
        this.httpServer.close(() => resolve());
      });

      // Close cache connection
      if (this.cacheManager) {
        await (this.cacheManager as CacheManager).close();
      }

      // Close event logger
      if (this.eventLogger) {
        await (this.eventLogger as EventLogger).shutdown();
      }

      // Disconnect from database
      await this.prisma.$disconnect();

      this.logger.info('Session Queue Service stopped successfully');

    } catch (error) {
      this.logger.error('Error stopping Session Queue Service', {
        error: error instanceof Error ? error.message : error
      });
      throw error;
    }
  }

  /**
   * Restart the service
   */
  async restart(): Promise<void> {
    this.logger.info('Restarting Session Queue Service...');
    await this.stop();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause
    await this.start();
  }

  /**
   * Health check for all services
   */
  async healthCheck(): Promise<{ status: string; services: Record<string, string> }> {
    const services: Record<string, string> = {};

    try {
      // Check database
      await this.prisma.$queryRaw`SELECT 1`;
      services.database = 'healthy';
    } catch {
      services.database = 'unhealthy';
    }

    // Check cache
    if (this.cacheManager) {
      try {
        const stats = await (this.cacheManager as CacheManager).getStats();
        services.cache = stats.connected ? 'healthy' : 'unhealthy';
      } catch {
        services.cache = 'unhealthy';
      }
    } else {
      services.cache = 'disabled';
    }

    // Check Socket.io
    services.socketio = this.io.sockets.sockets.size >= 0 ? 'healthy' : 'unhealthy';

    // Check queue processing
    try {
      const stats = await this.queueManager.getStats('NOTARIA_18_QUITO');
      services.queue = 'healthy';
    } catch {
      services.queue = 'unhealthy';
    }

    // Overall status
    const unhealthyServices = Object.values(services).filter(status => status === 'unhealthy');
    const overallStatus = unhealthyServices.length === 0 ? 'healthy' : 'degraded';

    return { status: overallStatus, services };
  }

  // Private initialization methods

  private initializeManagers(): void {
    // Initialize cache manager
    if (SESSION_QUEUE_CONFIG.redis.host) {
      this.cacheManager = new CacheManager(this.logger);
    }

    // Initialize event logger
    this.eventLogger = new EventLogger(this.prisma, this.logger);

    // Initialize config manager
    this.configManager = new ConfigManager(this.prisma, this.logger, this.cacheManager);

    // Initialize queue manager
    this.queueManager = new QueueManager(this.prisma, this.logger, this.cacheManager);

    // Initialize socket manager
    this.socketManager = new SocketManager(this.io, this.logger, this.cacheManager);

    // Initialize session manager
    this.sessionManager = new SessionManager(
      this.prisma, 
      this.logger, 
      this.cacheManager,
      this.socketManager
    );

    // Initialize QR generator
    this.qrGenerator = new QRGenerator(
      SESSION_QUEUE_CONFIG.qr.baseUrl,
      this.logger,
      SESSION_QUEUE_CONFIG.qr.outputDir,
      this.cacheManager
    );
  }

  private setupSocketEventHandlers(): void {
    this.logger.info('Setting up Socket.io event handlers');

    // Handle queue updates
    this.io.on('connection', (socket) => {
      // Custom handlers for queue-specific events
      socket.on('create-session', async (data: {
        documentId: string;
        clientName: string;
        tramiteType: string;
        notariaId: string;
        priority?: string;
        metadata?: any;
      }) => {
        await this.handleCreateSession(socket, data);
      });

      socket.on('activate-session', async (data: { sessionId: string }) => {
        await this.handleActivateSession(socket, data);
      });

      socket.on('complete-session', async (data: { sessionId: string; metadata?: any }) => {
        await this.handleCompleteSession(socket, data);
      });

      socket.on('get-queue-status', async (data: { notariaId: string }) => {
        await this.handleGetQueueStatus(socket, data);
      });

      socket.on('get-session-position', async (data: { sessionId: string }) => {
        await this.handleGetSessionPosition(socket, data);
      });

      socket.on('extend-session', async (data: { sessionId: string; minutes: number }) => {
        await this.handleExtendSession(socket, data);
      });

      socket.on('cancel-session', async (data: { sessionId: string; reason: string }) => {
        await this.handleCancelSession(socket, data);
      });

      // Admin-specific events
      socket.on('admin-call-next', async (data: { notariaId: string }) => {
        await this.handleAdminCallNext(socket, data);
      });

      socket.on('admin-get-stats', async (data: { notariaId: string }) => {
        await this.handleAdminGetStats(socket, data);
      });

      socket.on('admin-pause-queue', async (data: { notariaId: string; reason: string }) => {
        await this.handleAdminPauseQueue(socket, data);
      });
    });
  }

  private createLogger(): winston.Logger {
    const transports: winston.transport[] = [];

    // Console transport
    if (SESSION_QUEUE_CONFIG.logging.enableConsole) {
      transports.push(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
            return `${timestamp} [${level}] ${message} ${metaStr}`;
          })
        )
      }));
    }

    // File transport
    if (SESSION_QUEUE_CONFIG.logging.enableFile) {
      transports.push(new winston.transports.File({
        filename: `${SESSION_QUEUE_CONFIG.logging.logDir}/session-queue.log`,
        maxsize: SESSION_QUEUE_CONFIG.logging.maxSize,
        maxFiles: SESSION_QUEUE_CONFIG.logging.maxFiles,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        )
      }));
    }

    return winston.createLogger({
      level: SESSION_QUEUE_CONFIG.logging.level,
      transports
    });
  }

  private startBackgroundJobs(): void {
    this.logger.info('Starting background jobs');

    // Cleanup expired sessions every 5 minutes
    this.cleanupCron = cron.schedule('*/5 * * * *', async () => {
      try {
        const expired = await this.sessionManager.cleanupExpiredSessions();
        const queueExpired = await this.queueManager.cleanupExpired();
        
        if (expired > 0 || queueExpired > 0) {
          this.logger.info('Background cleanup completed', {
            expiredSessions: expired,
            expiredQueueItems: queueExpired
          });
        }
      } catch (error) {
        this.logger.error('Background cleanup failed', {
          error: error instanceof Error ? error.message : error
        });
      }
    });

    // Update queue statistics every minute
    cron.schedule('* * * * *', async () => {
      try {
        // Get active notarías
        const activeNotarias = await this.getActiveNotarias();
        
        for (const notariaId of activeNotarias) {
          const stats = await this.queueManager.getStats(notariaId);
          
          // Broadcast stats to admin rooms
          this.socketManager.broadcast(notariaId, 'stats-updated', {
            notariaId,
            stats,
            timestamp: Date.now()
          });
        }
      } catch (error) {
        this.logger.error('Stats update failed', {
          error: error instanceof Error ? error.message : error
        });
      }
    });

    // Clean old event logs daily at 2 AM
    cron.schedule('0 2 * * *', async () => {
      try {
        if (this.eventLogger) {
          const cleaned = await this.eventLogger.cleanup(30); // Keep 30 days
          this.logger.info('Event logs cleaned', { deletedEvents: cleaned });
        }
      } catch (error) {
        this.logger.error('Event log cleanup failed', {
          error: error instanceof Error ? error.message : error
        });
      }
    });
  }

  // Socket event handlers

  private async handleCreateSession(
    socket: any, 
    data: {
      documentId: string;
      clientName: string;
      tramiteType: string;
      notariaId: string;
      priority?: string;
      metadata?: any;
    }
  ): Promise<void> {
    try {
      this.logger.info('Creating new session via socket', {
        socketId: socket.id,
        clientName: data.clientName,
        tramiteType: data.tramiteType,
        notariaId: data.notariaId
      });

      // Get queue configuration
      const config = await this.configManager.getQueueConfig(data.notariaId);

      // Create session
      const session = await this.sessionManager.createSession({
        documentId: data.documentId,
        notariaId: data.notariaId,
        clientName: data.clientName,
        tramiteType: data.tramiteType as any,
        priority: data.priority as any || 'NORMAL',
        status: 'WAITING',
        position: 0, // Will be calculated by queue manager
        estimatedWaitTime: 0, // Will be calculated
        expiresAt: new Date(Date.now() + config.sessionTimeoutMinutes * 60 * 1000),
        metadata: {
          ...data.metadata,
          socketId: socket.id,
          createdViaSocket: true
        }
      });

      // Add to queue
      const queuedSession = await this.queueManager.addSession({
        ...session,
        id: undefined as any, // Let queue manager assign
        createdAt: undefined as any,
        updatedAt: undefined as any
      });

      // Join socket to session room
      this.socketManager.join(socket.id, `session:${queuedSession.id}`);

      // Send response
      socket.emit('session-created', {
        success: true,
        session: queuedSession,
        qrCode: await this.qrGenerator.generateSessionQR(queuedSession.id)
      });

      // Broadcast queue update
      this.broadcastQueueUpdate(data.notariaId);

      // Log event
      if (this.eventLogger) {
        await this.eventLogger.log({
          event: 'join-session',
          notariaId: data.notariaId,
          sessionId: queuedSession.id,
          socketId: socket.id,
          data: { clientName: data.clientName, tramiteType: data.tramiteType }
        });
      }

    } catch (error) {
      this.logger.error('Failed to create session via socket', {
        error: error instanceof Error ? error.message : error,
        socketId: socket.id,
        data
      });

      socket.emit('session-create-error', {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create session'
      });
    }
  }

  private async handleActivateSession(socket: any, data: { sessionId: string }): Promise<void> {
    try {
      const activatedSession = await this.sessionManager.activateSession(data.sessionId);
      
      if (activatedSession) {
        socket.emit('session-activated', {
          success: true,
          session: activatedSession
        });

        // Broadcast to notaría
        this.broadcastQueueUpdate(activatedSession.notariaId);
      } else {
        socket.emit('session-activation-error', {
          success: false,
          error: 'Session not found or cannot be activated'
        });
      }
    } catch (error) {
      this.logger.error('Failed to activate session via socket', {
        error: error instanceof Error ? error.message : error,
        sessionId: data.sessionId
      });

      socket.emit('session-activation-error', {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to activate session'
      });
    }
  }

  private async handleCompleteSession(
    socket: any, 
    data: { sessionId: string; metadata?: any }
  ): Promise<void> {
    try {
      const completedSession = await this.sessionManager.completeSession(
        data.sessionId, 
        data.metadata
      );
      
      if (completedSession) {
        socket.emit('session-completed', {
          success: true,
          session: completedSession
        });

        // Broadcast to notaría
        this.broadcastQueueUpdate(completedSession.notariaId);
      } else {
        socket.emit('session-completion-error', {
          success: false,
          error: 'Session not found or cannot be completed'
        });
      }
    } catch (error) {
      this.logger.error('Failed to complete session via socket', {
        error: error instanceof Error ? error.message : error,
        sessionId: data.sessionId
      });

      socket.emit('session-completion-error', {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to complete session'
      });
    }
  }

  private async handleGetQueueStatus(socket: any, data: { notariaId: string }): Promise<void> {
    try {
      const queue = await this.queueManager.getQueueByNotaria(data.notariaId);
      const stats = await this.queueManager.getStats(data.notariaId);

      socket.emit('queue-status', {
        success: true,
        notariaId: data.notariaId,
        queue,
        stats
      });
    } catch (error) {
      this.logger.error('Failed to get queue status', {
        error: error instanceof Error ? error.message : error,
        notariaId: data.notariaId
      });

      socket.emit('queue-status-error', {
        success: false,
        error: 'Failed to get queue status'
      });
    }
  }

  private async handleGetSessionPosition(socket: any, data: { sessionId: string }): Promise<void> {
    try {
      const position = await this.queueManager.getPosition(data.sessionId);
      const session = await this.sessionManager.getSession(data.sessionId);

      if (session) {
        socket.emit('session-position', {
          success: true,
          sessionId: data.sessionId,
          position,
          estimatedWaitTime: session.estimatedWaitTime,
          status: session.status
        });
      } else {
        socket.emit('session-position-error', {
          success: false,
          error: 'Session not found'
        });
      }
    } catch (error) {
      socket.emit('session-position-error', {
        success: false,
        error: 'Failed to get session position'
      });
    }
  }

  private async handleExtendSession(
    socket: any, 
    data: { sessionId: string; minutes: number }
  ): Promise<void> {
    try {
      const extendedSession = await this.sessionManager.extendSession(
        data.sessionId, 
        data.minutes
      );
      
      if (extendedSession) {
        socket.emit('session-extended', {
          success: true,
          session: extendedSession
        });
      } else {
        socket.emit('session-extend-error', {
          success: false,
          error: 'Session not found or cannot be extended'
        });
      }
    } catch (error) {
      socket.emit('session-extend-error', {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to extend session'
      });
    }
  }

  private async handleCancelSession(
    socket: any, 
    data: { sessionId: string; reason: string }
  ): Promise<void> {
    try {
      const cancelledSession = await this.sessionManager.cancelSession(
        data.sessionId, 
        data.reason
      );
      
      if (cancelledSession) {
        socket.emit('session-cancelled', {
          success: true,
          session: cancelledSession
        });

        // Broadcast to notaría
        this.broadcastQueueUpdate(cancelledSession.notariaId);
      } else {
        socket.emit('session-cancel-error', {
          success: false,
          error: 'Session not found or cannot be cancelled'
        });
      }
    } catch (error) {
      socket.emit('session-cancel-error', {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel session'
      });
    }
  }

  private async handleAdminCallNext(socket: any, data: { notariaId: string }): Promise<void> {
    try {
      const nextSession = await this.queueManager.moveToNext(data.notariaId);
      
      if (nextSession) {
        // Activate the session
        await this.sessionManager.activateSession(nextSession.id);
        
        socket.emit('admin-called-next', {
          success: true,
          session: nextSession
        });

        // Broadcast to notaría
        this.broadcastQueueUpdate(data.notariaId);
      } else {
        socket.emit('admin-call-next-error', {
          success: false,
          error: 'No sessions waiting in queue'
        });
      }
    } catch (error) {
      socket.emit('admin-call-next-error', {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to call next session'
      });
    }
  }

  private async handleAdminGetStats(socket: any, data: { notariaId: string }): Promise<void> {
    try {
      const stats = await this.queueManager.getStats(data.notariaId);
      const eventStats = this.eventLogger 
        ? await this.eventLogger.getStats(data.notariaId, 24)
        : null;

      socket.emit('admin-stats', {
        success: true,
        queueStats: stats,
        eventStats
      });
    } catch (error) {
      socket.emit('admin-stats-error', {
        success: false,
        error: 'Failed to get statistics'
      });
    }
  }

  private async handleAdminPauseQueue(
    socket: any, 
    data: { notariaId: string; reason: string }
  ): Promise<void> {
    try {
      // This would implement queue pausing logic
      // For now, just broadcast the pause event
      this.socketManager.broadcast(data.notariaId, 'queue-paused', {
        notariaId: data.notariaId,
        reason: data.reason
      });

      socket.emit('admin-queue-paused', {
        success: true,
        notariaId: data.notariaId,
        reason: data.reason
      });
    } catch (error) {
      socket.emit('admin-pause-error', {
        success: false,
        error: 'Failed to pause queue'
      });
    }
  }

  // Helper methods

  private async broadcastQueueUpdate(notariaId: string): Promise<void> {
    try {
      const queue = await this.queueManager.getQueueByNotaria(notariaId);
      const stats = await this.queueManager.getStats(notariaId);

      this.socketManager.broadcast(notariaId, 'queue-updated', {
        notariaId,
        sessions: queue,
        stats,
        timestamp: Date.now()
      });
    } catch (error) {
      this.logger.error('Failed to broadcast queue update', {
        error: error instanceof Error ? error.message : error,
        notariaId
      });
    }
  }

  private async getActiveNotarias(): Promise<string[]> {
    try {
      const activeSessions = await this.prisma.activeSession.findMany({
        where: { 
          status: { in: ['WAITING', 'READY', 'ACTIVE'] }
        },
        select: { notariaId: true },
        distinct: ['notariaId']
      });

      return activeSessions.map(session => session.notariaId);
    } catch (error) {
      this.logger.error('Failed to get active notarías', {
        error: error instanceof Error ? error.message : error
      });
      return Object.keys(DEFAULT_QUEUE_CONFIGS);
    }
  }
}