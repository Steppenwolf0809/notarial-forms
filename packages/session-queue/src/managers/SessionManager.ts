import { PrismaClient } from '@prisma/client';
import winston from 'winston';
import dayjs from 'dayjs';
import cron from 'node-cron';
import { v4 as uuidv4 } from 'uuid';
import {
  ISessionManager,
  ActiveSession,
  SessionStatus,
  CACHE_KEYS,
  QUEUE_EVENTS
} from '../types';
import { ICacheManager, ISocketManager } from '../types';

export class SessionManager implements ISessionManager {
  private prisma: PrismaClient;
  private logger: winston.Logger;
  private cache?: ICacheManager;
  private socketManager?: ISocketManager;
  private expirationTimers: Map<string, NodeJS.Timeout> = new Map();
  private cleanupCron?: cron.ScheduledTask;

  // Default timeouts (minutes)
  private readonly DEFAULT_SESSION_TIMEOUT = 120; // 2 hours
  private readonly DEFAULT_READY_TIMEOUT = 15;    // 15 minutes to respond when ready
  private readonly DEFAULT_ACTIVE_TIMEOUT = 60;   // 1 hour for active sessions

  constructor(
    prisma: PrismaClient,
    logger: winston.Logger,
    cache?: ICacheManager,
    socketManager?: ISocketManager
  ) {
    this.prisma = prisma;
    this.logger = logger;
    this.cache = cache;
    this.socketManager = socketManager;

    // Start cleanup cron job (every 5 minutes)
    this.startCleanupCron();
  }

  /**
   * Create new session with automatic expiration scheduling
   */
  async createSession(
    data: Omit<ActiveSession, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ActiveSession> {
    try {
      this.logger.info('Creating new session', {
        notariaId: data.notariaId,
        clientName: data.clientName,
        tramiteType: data.tramiteType,
        priority: data.priority
      });

      // Generate session ID
      const sessionId = `ses_${Date.now()}_${uuidv4().slice(0, 8)}`;

      // Set expiration time if not provided
      let expiresAt = data.expiresAt;
      if (!expiresAt) {
        expiresAt = dayjs().add(this.DEFAULT_SESSION_TIMEOUT, 'minutes').toDate();
      }

      // Create session
      const session = await this.prisma.activeSession.create({
        data: {
          ...data,
          id: sessionId,
          status: 'WAITING',
          createdAt: new Date(),
          updatedAt: new Date(),
          expiresAt,
          metadata: {
            ...data.metadata,
            createdBy: 'session-manager',
            lifecycle: {
              created: new Date().toISOString(),
              events: []
            }
          }
        }
      });

      // Schedule expiration
      this.scheduleExpiration(session as ActiveSession);

      // Cache session
      if (this.cache) {
        await this.cache.set(
          CACHE_KEYS.SESSION(sessionId),
          session,
          1800 // 30 minutes
        );
      }

      // Emit creation event
      this.emitSessionEvent(QUEUE_EVENTS.SESSION_CREATED, session as ActiveSession);

      this.logger.info('Session created successfully', {
        sessionId,
        expiresAt: expiresAt.toISOString(),
        estimatedWaitTime: data.estimatedWaitTime
      });

      return session as ActiveSession;

    } catch (error) {
      this.logger.error('Failed to create session', {
        error: error instanceof Error ? error.message : error,
        data
      });
      throw error;
    }
  }

  /**
   * Activate session (mark as currently being attended)
   */
  async activateSession(sessionId: string): Promise<ActiveSession | null> {
    try {
      this.logger.info('Activating session', { sessionId });

      const session = await this.getSession(sessionId);
      if (!session) {
        this.logger.warn('Session not found for activation', { sessionId });
        return null;
      }

      // Check if session is in valid state for activation
      if (session.status !== 'READY' && session.status !== 'WAITING') {
        this.logger.warn('Session not in valid state for activation', {
          sessionId,
          currentStatus: session.status
        });
        throw new Error(`Session cannot be activated from status: ${session.status}`);
      }

      // Check if session is expired
      if (this.isSessionExpired(session)) {
        await this.expireSession(sessionId, 'Expired before activation');
        return null;
      }

      // Update session to active
      const updatedSession = await this.prisma.activeSession.update({
        where: { id: sessionId },
        data: {
          status: 'ACTIVE',
          calledAt: new Date(),
          updatedAt: new Date(),
          metadata: {
            ...session.metadata,
            lifecycle: {
              ...((session.metadata as any)?.lifecycle || {}),
              activated: new Date().toISOString(),
              events: [
                ...((session.metadata as any)?.lifecycle?.events || []),
                {
                  type: 'activated',
                  timestamp: new Date().toISOString(),
                  data: { previousStatus: session.status }
                }
              ]
            }
          }
        }
      });

      // Clear existing expiration timer
      this.clearExpirationTimer(sessionId);

      // Set new expiration for active session (1 hour default)
      const activeExpiresAt = dayjs().add(this.DEFAULT_ACTIVE_TIMEOUT, 'minutes').toDate();
      await this.prisma.activeSession.update({
        where: { id: sessionId },
        data: { expiresAt: activeExpiresAt }
      });

      const finalSession = { ...updatedSession, expiresAt: activeExpiresAt } as ActiveSession;

      // Schedule new expiration
      this.scheduleExpiration(finalSession);

      // Update cache
      if (this.cache) {
        await this.cache.set(
          CACHE_KEYS.SESSION(sessionId),
          finalSession,
          1800
        );
        
        // Clear queue cache for notaria
        await this.cache.del(CACHE_KEYS.QUEUE(session.notariaId));
      }

      // Send notifications
      if (this.socketManager) {
        this.socketManager.sendNotification(sessionId, {
          type: 'SESSION_CALLED',
          title: 'Tu turno ha sido llamado',
          message: 'Por favor dirígete al counter correspondiente',
          sessionId,
          priority: 'high'
        });

        // Broadcast session called to notaria
        this.socketManager.broadcast(session.notariaId, 'session-called', {
          sessionId,
          clientName: session.clientName,
          counter: (session.metadata as any)?.counter || 1,
          message: `${session.clientName} - ${session.tramiteType}`
        });
      }

      // Emit event
      this.emitSessionEvent(QUEUE_EVENTS.SESSION_CALLED, finalSession);

      this.logger.info('Session activated successfully', {
        sessionId,
        clientName: session.clientName,
        newExpiresAt: activeExpiresAt.toISOString()
      });

      return finalSession;

    } catch (error) {
      this.logger.error('Failed to activate session', {
        error: error instanceof Error ? error.message : error,
        sessionId
      });
      return null;
    }
  }

  /**
   * Complete session successfully
   */
  async completeSession(sessionId: string, metadata?: any): Promise<ActiveSession | null> {
    try {
      this.logger.info('Completing session', { sessionId, metadata });

      const session = await this.getSession(sessionId);
      if (!session) {
        this.logger.warn('Session not found for completion', { sessionId });
        return null;
      }

      // Check if session is active
      if (session.status !== 'ACTIVE') {
        this.logger.warn('Session not active for completion', {
          sessionId,
          currentStatus: session.status
        });
        throw new Error(`Session cannot be completed from status: ${session.status}`);
      }

      // Calculate service time
      const serviceTime = session.calledAt 
        ? dayjs().diff(session.calledAt, 'minutes')
        : 0;

      // Calculate total wait time
      const totalWaitTime = dayjs().diff(session.createdAt, 'minutes');

      // Update session
      const completedSession = await this.prisma.activeSession.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          updatedAt: new Date(),
          metadata: {
            ...session.metadata,
            ...metadata,
            completion: {
              serviceTime,
              totalWaitTime,
              completedBy: metadata?.completedBy || 'system',
              notes: metadata?.notes || ''
            },
            lifecycle: {
              ...((session.metadata as any)?.lifecycle || {}),
              completed: new Date().toISOString(),
              events: [
                ...((session.metadata as any)?.lifecycle?.events || []),
                {
                  type: 'completed',
                  timestamp: new Date().toISOString(),
                  data: { serviceTime, totalWaitTime, metadata }
                }
              ]
            }
          }
        }
      });

      // Clear expiration timer
      this.clearExpirationTimer(sessionId);

      // Update cache
      if (this.cache) {
        await this.cache.set(
          CACHE_KEYS.SESSION(sessionId),
          completedSession,
          3600 // Keep completed sessions cached for 1 hour
        );
        
        // Clear queue cache
        await this.cache.del(CACHE_KEYS.QUEUE(session.notariaId));
      }

      // Send notifications
      if (this.socketManager) {
        this.socketManager.sendNotification(sessionId, {
          type: 'SESSION_READY', // Using existing type
          title: 'Trámite completado',
          message: `Tu trámite ha sido completado exitosamente en ${serviceTime} minutos`,
          sessionId,
          data: { serviceTime, totalWaitTime },
          priority: 'normal'
        });

        // Broadcast completion to admins
        this.socketManager.broadcast(session.notariaId, 'session-completed', {
          sessionId,
          clientName: session.clientName,
          tramiteType: session.tramiteType,
          serviceTime,
          totalWaitTime
        });
      }

      // Emit event
      this.emitSessionEvent(QUEUE_EVENTS.SESSION_COMPLETED, completedSession as ActiveSession);

      this.logger.info('Session completed successfully', {
        sessionId,
        clientName: session.clientName,
        serviceTime,
        totalWaitTime
      });

      return completedSession as ActiveSession;

    } catch (error) {
      this.logger.error('Failed to complete session', {
        error: error instanceof Error ? error.message : error,
        sessionId,
        metadata
      });
      return null;
    }
  }

  /**
   * Expire session due to timeout or inactivity
   */
  async expireSession(sessionId: string, reason: string): Promise<ActiveSession | null> {
    try {
      this.logger.info('Expiring session', { sessionId, reason });

      const session = await this.getSession(sessionId);
      if (!session) {
        this.logger.warn('Session not found for expiration', { sessionId });
        return null;
      }

      // Don't expire already completed or expired sessions
      if (session.status === 'COMPLETED' || session.status === 'EXPIRED') {
        this.logger.debug('Session already in terminal state', {
          sessionId,
          status: session.status
        });
        return session;
      }

      // Calculate how long the session was active
      const lifetime = dayjs().diff(session.createdAt, 'minutes');

      // Update session
      const expiredSession = await this.prisma.activeSession.update({
        where: { id: sessionId },
        data: {
          status: 'EXPIRED',
          updatedAt: new Date(),
          metadata: {
            ...session.metadata,
            expiration: {
              reason,
              expiredAt: new Date().toISOString(),
              lifetime,
              lastStatus: session.status
            },
            lifecycle: {
              ...((session.metadata as any)?.lifecycle || {}),
              expired: new Date().toISOString(),
              events: [
                ...((session.metadata as any)?.lifecycle?.events || []),
                {
                  type: 'expired',
                  timestamp: new Date().toISOString(),
                  data: { reason, lifetime, lastStatus: session.status }
                }
              ]
            }
          }
        }
      });

      // Clear expiration timer
      this.clearExpirationTimer(sessionId);

      // Update cache
      if (this.cache) {
        await this.cache.set(
          CACHE_KEYS.SESSION(sessionId),
          expiredSession,
          1800
        );
        
        // Clear queue cache
        await this.cache.del(CACHE_KEYS.QUEUE(session.notariaId));
      }

      // Send notifications
      if (this.socketManager) {
        this.socketManager.sendNotification(sessionId, {
          type: 'SESSION_EXPIRED',
          title: 'Sesión expirada',
          message: `Tu sesión ha expirado: ${reason}`,
          sessionId,
          data: { reason, canRenew: this.canRenewSession(session) },
          priority: 'high'
        });

        // Broadcast expiration
        this.socketManager.broadcast(session.notariaId, 'session-expired', {
          sessionId,
          reason,
          canRenew: this.canRenewSession(session)
        });
      }

      // Emit event
      this.emitSessionEvent(QUEUE_EVENTS.SESSION_EXPIRED, expiredSession as ActiveSession);

      this.logger.info('Session expired successfully', {
        sessionId,
        reason,
        lifetime,
        lastStatus: session.status
      });

      return expiredSession as ActiveSession;

    } catch (error) {
      this.logger.error('Failed to expire session', {
        error: error instanceof Error ? error.message : error,
        sessionId,
        reason
      });
      return null;
    }
  }

  /**
   * Extend session timeout
   */
  async extendSession(sessionId: string, additionalMinutes: number): Promise<ActiveSession | null> {
    try {
      this.logger.info('Extending session', { sessionId, additionalMinutes });

      const session = await this.getSession(sessionId);
      if (!session) {
        this.logger.warn('Session not found for extension', { sessionId });
        return null;
      }

      // Check if session can be extended
      if (session.status === 'COMPLETED' || session.status === 'EXPIRED' || session.status === 'CANCELLED') {
        throw new Error(`Session cannot be extended from status: ${session.status}`);
      }

      // Calculate new expiration time
      const newExpiresAt = dayjs(session.expiresAt).add(additionalMinutes, 'minutes').toDate();

      // Update session
      const extendedSession = await this.prisma.activeSession.update({
        where: { id: sessionId },
        data: {
          expiresAt: newExpiresAt,
          updatedAt: new Date(),
          metadata: {
            ...session.metadata,
            extensions: [
              ...((session.metadata as any)?.extensions || []),
              {
                timestamp: new Date().toISOString(),
                additionalMinutes,
                reason: 'Manual extension',
                newExpiresAt: newExpiresAt.toISOString()
              }
            ],
            lifecycle: {
              ...((session.metadata as any)?.lifecycle || {}),
              events: [
                ...((session.metadata as any)?.lifecycle?.events || []),
                {
                  type: 'extended',
                  timestamp: new Date().toISOString(),
                  data: { additionalMinutes, newExpiresAt: newExpiresAt.toISOString() }
                }
              ]
            }
          }
        }
      });

      // Clear old timer and schedule new expiration
      this.clearExpirationTimer(sessionId);
      this.scheduleExpiration(extendedSession as ActiveSession);

      // Update cache
      if (this.cache) {
        await this.cache.set(
          CACHE_KEYS.SESSION(sessionId),
          extendedSession,
          1800
        );
      }

      // Send notification
      if (this.socketManager) {
        this.socketManager.sendNotification(sessionId, {
          type: 'SESSION_READY', // Using existing type
          title: 'Sesión extendida',
          message: `Tu sesión ha sido extendida por ${additionalMinutes} minutos`,
          sessionId,
          data: { additionalMinutes, newExpiresAt },
          priority: 'normal'
        });
      }

      this.logger.info('Session extended successfully', {
        sessionId,
        additionalMinutes,
        newExpiresAt: newExpiresAt.toISOString()
      });

      return extendedSession as ActiveSession;

    } catch (error) {
      this.logger.error('Failed to extend session', {
        error: error instanceof Error ? error.message : error,
        sessionId,
        additionalMinutes
      });
      return null;
    }
  }

  /**
   * Cancel session manually
   */
  async cancelSession(sessionId: string, reason: string): Promise<ActiveSession | null> {
    try {
      this.logger.info('Cancelling session', { sessionId, reason });

      const session = await this.getSession(sessionId);
      if (!session) {
        this.logger.warn('Session not found for cancellation', { sessionId });
        return null;
      }

      // Don't cancel already completed sessions
      if (session.status === 'COMPLETED') {
        throw new Error('Cannot cancel completed session');
      }

      // Update session
      const cancelledSession = await this.prisma.activeSession.update({
        where: { id: sessionId },
        data: {
          status: 'CANCELLED',
          updatedAt: new Date(),
          metadata: {
            ...session.metadata,
            cancellation: {
              reason,
              cancelledAt: new Date().toISOString(),
              lastStatus: session.status
            },
            lifecycle: {
              ...((session.metadata as any)?.lifecycle || {}),
              cancelled: new Date().toISOString(),
              events: [
                ...((session.metadata as any)?.lifecycle?.events || []),
                {
                  type: 'cancelled',
                  timestamp: new Date().toISOString(),
                  data: { reason, lastStatus: session.status }
                }
              ]
            }
          }
        }
      });

      // Clear expiration timer
      this.clearExpirationTimer(sessionId);

      // Update cache
      if (this.cache) {
        await this.cache.set(
          CACHE_KEYS.SESSION(sessionId),
          cancelledSession,
          1800
        );
        
        // Clear queue cache
        await this.cache.del(CACHE_KEYS.QUEUE(session.notariaId));
      }

      // Send notifications
      if (this.socketManager) {
        this.socketManager.sendNotification(sessionId, {
          type: 'SESSION_EXPIRED', // Using existing type for cancellation
          title: 'Sesión cancelada',
          message: `Tu sesión ha sido cancelada: ${reason}`,
          sessionId,
          data: { reason },
          priority: 'normal'
        });

        // Broadcast cancellation
        this.socketManager.broadcast(session.notariaId, 'session-cancelled', {
          sessionId,
          reason,
          timestamp: new Date()
        });
      }

      // Emit event
      this.emitSessionEvent(QUEUE_EVENTS.SESSION_CANCELLED, cancelledSession as ActiveSession);

      this.logger.info('Session cancelled successfully', {
        sessionId,
        reason,
        lastStatus: session.status
      });

      return cancelledSession as ActiveSession;

    } catch (error) {
      this.logger.error('Failed to cancel session', {
        error: error instanceof Error ? error.message : error,
        sessionId,
        reason
      });
      return null;
    }
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<ActiveSession | null> {
    try {
      // Try cache first
      if (this.cache) {
        const cached = await this.cache.get<ActiveSession>(
          CACHE_KEYS.SESSION(sessionId)
        );
        if (cached) {
          return cached;
        }
      }

      // Fallback to database
      const session = await this.prisma.activeSession.findUnique({
        where: { id: sessionId }
      });

      // Cache the result
      if (session && this.cache) {
        await this.cache.set(
          CACHE_KEYS.SESSION(sessionId),
          session,
          1800
        );
      }

      return session as ActiveSession | null;

    } catch (error) {
      this.logger.error('Failed to get session', {
        error: error instanceof Error ? error.message : error,
        sessionId
      });
      return null;
    }
  }

  /**
   * Get sessions by status for a notaria
   */
  async getSessionsByStatus(notariaId: string, status: SessionStatus): Promise<ActiveSession[]> {
    try {
      const sessions = await this.prisma.activeSession.findMany({
        where: {
          notariaId,
          status
        },
        orderBy: { position: 'asc' }
      });

      return sessions as ActiveSession[];

    } catch (error) {
      this.logger.error('Failed to get sessions by status', {
        error: error instanceof Error ? error.message : error,
        notariaId,
        status
      });
      return [];
    }
  }

  /**
   * Check if session is expired
   */
  isSessionExpired(session: ActiveSession): boolean {
    return dayjs().isAfter(session.expiresAt);
  }

  /**
   * Schedule session expiration
   */
  scheduleExpiration(session: ActiveSession): void {
    // Clear existing timer
    this.clearExpirationTimer(session.id);

    const now = dayjs();
    const expiresAt = dayjs(session.expiresAt);
    const delay = expiresAt.diff(now);

    if (delay <= 0) {
      // Already expired, expire immediately
      this.expireSession(session.id, 'Session timeout');
      return;
    }

    // Schedule expiration
    const timer = setTimeout(() => {
      this.expireSession(session.id, 'Session timeout');
    }, delay);

    this.expirationTimers.set(session.id, timer);

    this.logger.debug('Expiration scheduled', {
      sessionId: session.id,
      expiresAt: expiresAt.toISOString(),
      delayMs: delay
    });
  }

  /**
   * Cleanup expired sessions
   */
  async cleanupExpiredSessions(notariaId?: string): Promise<number> {
    try {
      const where: any = {
        status: { in: ['WAITING', 'READY', 'ACTIVE'] },
        expiresAt: { lt: new Date() }
      };

      if (notariaId) {
        where.notariaId = notariaId;
      }

      // Get expired sessions
      const expiredSessions = await this.prisma.activeSession.findMany({
        where,
        select: { id: true, notariaId: true, clientName: true }
      });

      if (expiredSessions.length === 0) {
        return 0;
      }

      // Expire each session properly (to trigger notifications)
      const expiredPromises = expiredSessions.map(session =>
        this.expireSession(session.id, 'Automated cleanup')
      );

      await Promise.all(expiredPromises);

      this.logger.info('Expired sessions cleaned up', {
        count: expiredSessions.length,
        notariaId
      });

      return expiredSessions.length;

    } catch (error) {
      this.logger.error('Failed to cleanup expired sessions', {
        error: error instanceof Error ? error.message : error,
        notariaId
      });
      return 0;
    }
  }

  // Private methods

  private clearExpirationTimer(sessionId: string): void {
    const timer = this.expirationTimers.get(sessionId);
    if (timer) {
      clearTimeout(timer);
      this.expirationTimers.delete(sessionId);
    }
  }

  private canRenewSession(session: ActiveSession): boolean {
    // Allow renewal if session was expired while waiting or ready
    return ['WAITING', 'READY'].includes(session.status);
  }

  private emitSessionEvent(event: string, session: ActiveSession): void {
    // This could be used to emit events to external systems
    // For now, just log the event
    this.logger.debug('Session event emitted', {
      event,
      sessionId: session.id,
      status: session.status
    });
  }

  private startCleanupCron(): void {
    // Run every 5 minutes
    this.cleanupCron = cron.schedule('*/5 * * * *', async () => {
      this.logger.debug('Running scheduled session cleanup');
      const cleaned = await this.cleanupExpiredSessions();
      if (cleaned > 0) {
        this.logger.info('Scheduled cleanup completed', { sessionsExpired: cleaned });
      }
    });

    this.logger.info('Session cleanup cron job started');
  }
}