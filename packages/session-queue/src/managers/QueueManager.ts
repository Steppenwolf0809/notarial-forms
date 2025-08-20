import { PrismaClient } from '@prisma/client';
import winston from 'winston';
import dayjs from 'dayjs';
import { 
  IQueueManager, 
  ActiveSession, 
  QueueStats, 
  SessionStatus,
  PriorityLevel,
  TramiteType,
  QueueFilter,
  QueueSort,
  CACHE_KEYS
} from '../types';
import { ICacheManager } from '../types';

export class QueueManager implements IQueueManager {
  private prisma: PrismaClient;
  private logger: winston.Logger;
  private cache?: ICacheManager;

  // Priority weights for queue ordering
  private readonly priorityWeights = {
    CRITICAL: 10,
    HIGH: 8,
    NORMAL: 5,
    LOW: 2
  };

  // Tramite time estimates (minutes)
  private readonly tramiteTimeEstimates = {
    VEHICULO: 15,
    COMPRAVENTA: 25,
    DONACION: 20,
    CONSTITUCION_SOCIEDAD: 45,
    FIDEICOMISO: 35,
    CONSORCIO: 30,
    DILIGENCIA: 20,
    HIPOTECA: 30,
    PODER: 15,
    TESTAMENTO: 40,
    OTRO: 20
  };

  constructor(
    prisma: PrismaClient, 
    logger: winston.Logger,
    cache?: ICacheManager
  ) {
    this.prisma = prisma;
    this.logger = logger;
    this.cache = cache;
  }

  /**
   * Add new session to queue with automatic position calculation
   */
  async addSession(
    sessionData: Omit<ActiveSession, 'id' | 'position' | 'createdAt' | 'updatedAt'>
  ): Promise<ActiveSession> {
    try {
      this.logger.info('Adding new session to queue', {
        notariaId: sessionData.notariaId,
        clientName: sessionData.clientName,
        tramiteType: sessionData.tramiteType,
        priority: sessionData.priority
      });

      // Get next position based on priority and FIFO
      const position = await this.calculateNextPosition(
        sessionData.notariaId,
        sessionData.priority,
        sessionData.tramiteType
      );

      // Calculate estimated wait time
      const estimatedWaitTime = await this.estimateWaitTime(
        sessionData.notariaId,
        position
      );

      // Create session in database
      const session = await this.prisma.activeSession.create({
        data: {
          ...sessionData,
          position,
          estimatedWaitTime,
          status: 'WAITING',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Update positions of affected sessions
      await this.updatePositions(sessionData.notariaId);

      // Cache the session
      if (this.cache) {
        await this.cache.set(
          CACHE_KEYS.SESSION(session.id),
          session,
          1800 // 30 minutes
        );
        
        // Invalidate queue cache
        await this.cache.del(CACHE_KEYS.QUEUE(sessionData.notariaId));
      }

      this.logger.info('Session added successfully', {
        sessionId: session.id,
        position: session.position,
        estimatedWaitTime: session.estimatedWaitTime
      });

      return session as ActiveSession;

    } catch (error) {
      this.logger.error('Failed to add session to queue', {
        error: error instanceof Error ? error.message : error,
        sessionData
      });
      throw error;
    }
  }

  /**
   * Remove session from queue and update positions
   */
  async removeSession(sessionId: string): Promise<boolean> {
    try {
      this.logger.info('Removing session from queue', { sessionId });

      // Get session first to know which notaria to update
      const session = await this.getSession(sessionId);
      if (!session) {
        this.logger.warn('Session not found for removal', { sessionId });
        return false;
      }

      // Delete session
      await this.prisma.activeSession.delete({
        where: { id: sessionId }
      });

      // Update positions of remaining sessions
      await this.updatePositions(session.notariaId);

      // Clear cache
      if (this.cache) {
        await this.cache.del(CACHE_KEYS.SESSION(sessionId));
        await this.cache.del(CACHE_KEYS.QUEUE(session.notariaId));
      }

      this.logger.info('Session removed successfully', { sessionId });
      return true;

    } catch (error) {
      this.logger.error('Failed to remove session', {
        error: error instanceof Error ? error.message : error,
        sessionId
      });
      return false;
    }
  }

  /**
   * Update session with position recalculation if needed
   */
  async updateSession(
    sessionId: string, 
    updates: Partial<ActiveSession>
  ): Promise<ActiveSession | null> {
    try {
      this.logger.info('Updating session', { sessionId, updates });

      const currentSession = await this.getSession(sessionId);
      if (!currentSession) {
        this.logger.warn('Session not found for update', { sessionId });
        return null;
      }

      // Check if priority changed (requires position recalculation)
      const priorityChanged = updates.priority && updates.priority !== currentSession.priority;

      // Update session
      const updatedSession = await this.prisma.activeSession.update({
        where: { id: sessionId },
        data: {
          ...updates,
          updatedAt: new Date()
        }
      });

      // Recalculate positions if priority changed
      if (priorityChanged) {
        await this.updatePositions(currentSession.notariaId);
        
        // Get updated session with new position
        const refreshedSession = await this.prisma.activeSession.findUnique({
          where: { id: sessionId }
        });
        
        if (refreshedSession) {
          refreshedSession.estimatedWaitTime = await this.estimateWaitTime(
            refreshedSession.notariaId,
            refreshedSession.position
          );
          
          await this.prisma.activeSession.update({
            where: { id: sessionId },
            data: { estimatedWaitTime: refreshedSession.estimatedWaitTime }
          });
        }
      }

      // Update cache
      if (this.cache) {
        const finalSession = priorityChanged 
          ? await this.getSession(sessionId)
          : updatedSession;
          
        if (finalSession) {
          await this.cache.set(
            CACHE_KEYS.SESSION(sessionId),
            finalSession,
            1800
          );
        }
        
        await this.cache.del(CACHE_KEYS.QUEUE(currentSession.notariaId));
      }

      this.logger.info('Session updated successfully', {
        sessionId,
        priorityChanged,
        newStatus: updates.status
      });

      return (priorityChanged ? await this.getSession(sessionId) : updatedSession) as ActiveSession;

    } catch (error) {
      this.logger.error('Failed to update session', {
        error: error instanceof Error ? error.message : error,
        sessionId,
        updates
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
   * Get queue for specific notaria with intelligent sorting
   */
  async getQueueByNotaria(
    notariaId: string,
    filter?: QueueFilter,
    sort?: QueueSort
  ): Promise<ActiveSession[]> {
    try {
      // Try cache first
      const cacheKey = CACHE_KEYS.QUEUE(notariaId);
      if (this.cache && !filter && !sort) {
        const cached = await this.cache.get<ActiveSession[]>(cacheKey);
        if (cached) {
          return cached;
        }
      }

      // Build where clause
      const where: any = {
        notariaId,
        status: { not: 'COMPLETED' }
      };

      if (filter) {
        if (filter.status) where.status = filter.status;
        if (filter.tramiteType) where.tramiteType = filter.tramiteType;
        if (filter.priority) where.priority = filter.priority;
      }

      // Build order by clause
      let orderBy: any = [
        { position: 'asc' }
      ];

      if (sort) {
        orderBy = [{ [sort.field]: sort.direction }];
      }

      // Get sessions from database
      const sessions = await this.prisma.activeSession.findMany({
        where,
        orderBy,
        include: {
          document: {
            select: {
              fileName: true,
              type: true,
              extractedFields: {
                select: {
                  fieldName: true,
                  value: true,
                  confidence: true
                }
              }
            }
          }
        }
      });

      // Apply intelligent sorting if no custom sort
      let sortedSessions = sessions;
      if (!sort) {
        sortedSessions = this.applySortingLogic(sessions as ActiveSession[]);
      }

      // Cache result
      if (this.cache && !filter && !sort) {
        await this.cache.set(cacheKey, sortedSessions, 300); // 5 minutes
      }

      return sortedSessions as ActiveSession[];

    } catch (error) {
      this.logger.error('Failed to get queue by notaria', {
        error: error instanceof Error ? error.message : error,
        notariaId,
        filter
      });
      return [];
    }
  }

  /**
   * Get current position for a session
   */
  async getPosition(sessionId: string): Promise<number> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      // Get real-time position by counting sessions ahead
      const sessionsAhead = await this.prisma.activeSession.count({
        where: {
          notariaId: session.notariaId,
          status: { in: ['WAITING', 'READY'] },
          OR: [
            {
              // Higher priority sessions
              priority: {
                in: this.getHigherPriorities(session.priority)
              }
            },
            {
              // Same priority but earlier created
              priority: session.priority,
              createdAt: { lt: session.createdAt }
            }
          ]
        }
      });

      return sessionsAhead + 1;

    } catch (error) {
      this.logger.error('Failed to get position', {
        error: error instanceof Error ? error.message : error,
        sessionId
      });
      return -1;
    }
  }

  /**
   * Move next session in queue to READY status
   */
  async moveToNext(notariaId: string): Promise<ActiveSession | null> {
    try {
      this.logger.info('Moving next session to ready', { notariaId });

      // Get next session in queue
      const nextSession = await this.prisma.activeSession.findFirst({
        where: {
          notariaId,
          status: 'WAITING'
        },
        orderBy: [
          { position: 'asc' }
        ]
      });

      if (!nextSession) {
        this.logger.info('No waiting sessions found', { notariaId });
        return null;
      }

      // Update session to READY
      const readySession = await this.prisma.activeSession.update({
        where: { id: nextSession.id },
        data: {
          status: 'READY',
          readyAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Update cache
      if (this.cache) {
        await this.cache.set(
          CACHE_KEYS.SESSION(readySession.id),
          readySession,
          1800
        );
        await this.cache.del(CACHE_KEYS.QUEUE(notariaId));
      }

      this.logger.info('Session moved to ready', {
        sessionId: readySession.id,
        clientName: readySession.clientName
      });

      return readySession as ActiveSession;

    } catch (error) {
      this.logger.error('Failed to move next session', {
        error: error instanceof Error ? error.message : error,
        notariaId
      });
      return null;
    }
  }

  /**
   * Update all positions for a notaria's queue
   */
  async updatePositions(notariaId: string): Promise<void> {
    try {
      this.logger.debug('Updating positions for notaria', { notariaId });

      // Get all waiting and ready sessions
      const sessions = await this.prisma.activeSession.findMany({
        where: {
          notariaId,
          status: { in: ['WAITING', 'READY'] }
        },
        orderBy: [
          { createdAt: 'asc' }
        ]
      });

      // Apply intelligent sorting
      const sortedSessions = this.applySortingLogic(sessions as ActiveSession[]);

      // Update positions
      const updates = sortedSessions.map((session, index) => 
        this.prisma.activeSession.update({
          where: { id: session.id },
          data: { 
            position: index + 1,
            estimatedWaitTime: this.calculateEstimatedWaitTime(index, sortedSessions)
          }
        })
      );

      await Promise.all(updates);

      // Clear cache
      if (this.cache) {
        await this.cache.del(CACHE_KEYS.QUEUE(notariaId));
      }

      this.logger.debug('Positions updated', {
        notariaId,
        sessionsUpdated: sortedSessions.length
      });

    } catch (error) {
      this.logger.error('Failed to update positions', {
        error: error instanceof Error ? error.message : error,
        notariaId
      });
    }
  }

  /**
   * Estimate wait time based on position and queue analysis
   */
  async estimateWaitTime(notariaId: string, position: number): Promise<number> {
    try {
      // Get historical data for better estimation
      const recentCompletions = await this.prisma.activeSession.findMany({
        where: {
          notariaId,
          status: 'COMPLETED',
          completedAt: {
            gte: dayjs().subtract(7, 'days').toDate()
          }
        },
        select: {
          tramiteType: true,
          createdAt: true,
          completedAt: true
        }
      });

      // Calculate average service time
      let averageServiceTime = 20; // Default 20 minutes
      if (recentCompletions.length > 0) {
        const totalTime = recentCompletions.reduce((sum, session) => {
          if (session.completedAt && session.createdAt) {
            return sum + dayjs(session.completedAt).diff(session.createdAt, 'minutes');
          }
          return sum;
        }, 0);
        averageServiceTime = Math.round(totalTime / recentCompletions.length);
      }

      // Get current active sessions to adjust estimate
      const activeSessions = await this.prisma.activeSession.count({
        where: {
          notariaId,
          status: 'ACTIVE'
        }
      });

      // Base calculation: (position - 1) * average time per session
      let estimatedTime = (position - 1) * averageServiceTime;

      // Adjust for current load
      if (activeSessions > 0) {
        estimatedTime += activeSessions * (averageServiceTime * 0.5); // Reduce by half for active sessions
      }

      // Factor in time of day (busier hours = longer wait)
      const currentHour = dayjs().hour();
      const peakHours = [9, 10, 11, 14, 15, 16]; // Typical peak hours
      if (peakHours.includes(currentHour)) {
        estimatedTime *= 1.2; // 20% increase during peak hours
      }

      return Math.max(0, Math.round(estimatedTime));

    } catch (error) {
      this.logger.error('Failed to estimate wait time', {
        error: error instanceof Error ? error.message : error,
        notariaId,
        position
      });
      
      // Fallback calculation
      return position * 20;
    }
  }

  /**
   * Get comprehensive queue statistics
   */
  async getStats(notariaId: string): Promise<QueueStats> {
    try {
      const cacheKey = CACHE_KEYS.STATS(notariaId);
      
      // Try cache first
      if (this.cache) {
        const cached = await this.cache.get<QueueStats>(cacheKey);
        if (cached) {
          return cached;
        }
      }

      const today = dayjs().startOf('day').toDate();
      const endOfDay = dayjs().endOf('day').toDate();

      // Get current session counts
      const [
        totalSessions,
        waitingSessions, 
        activeSessions,
        readySessions,
        completedToday
      ] = await Promise.all([
        this.prisma.activeSession.count({
          where: { notariaId, status: { not: 'COMPLETED' } }
        }),
        this.prisma.activeSession.count({
          where: { notariaId, status: 'WAITING' }
        }),
        this.prisma.activeSession.count({
          where: { notariaId, status: 'ACTIVE' }
        }),
        this.prisma.activeSession.count({
          where: { notariaId, status: 'READY' }
        }),
        this.prisma.activeSession.count({
          where: {
            notariaId,
            status: 'COMPLETED',
            completedAt: { gte: today, lte: endOfDay }
          }
        })
      ]);

      // Get completed sessions for analysis
      const completedSessions = await this.prisma.activeSession.findMany({
        where: {
          notariaId,
          status: 'COMPLETED',
          completedAt: { gte: dayjs().subtract(7, 'days').toDate() }
        },
        select: {
          tramiteType: true,
          priority: true,
          createdAt: true,
          completedAt: true,
          readyAt: true
        }
      });

      // Calculate wait and service times
      const waitTimes = completedSessions
        .filter(s => s.readyAt && s.createdAt)
        .map(s => dayjs(s.readyAt!).diff(s.createdAt, 'minutes'));

      const serviceTimes = completedSessions
        .filter(s => s.completedAt && s.readyAt)
        .map(s => dayjs(s.completedAt!).diff(s.readyAt!, 'minutes'));

      // Calculate distributions
      const tramiteTypeDistribution: Record<string, number> = {};
      const priorityDistribution: Record<string, number> = {};

      completedSessions.forEach(session => {
        tramiteTypeDistribution[session.tramiteType] = 
          (tramiteTypeDistribution[session.tramiteType] || 0) + 1;
        priorityDistribution[session.priority] = 
          (priorityDistribution[session.priority] || 0) + 1;
      });

      // Calculate hourly activity
      const hourlyActivity = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: completedSessions.filter(s => 
          dayjs(s.createdAt).hour() === hour
        ).length,
        avgWaitTime: 0
      }));

      // Calculate average wait time per hour
      hourlyActivity.forEach(hourData => {
        const hourSessions = completedSessions.filter(s => 
          dayjs(s.createdAt).hour() === hourData.hour
        );
        if (hourSessions.length > 0) {
          const totalWait = hourSessions.reduce((sum, s) => {
            if (s.readyAt && s.createdAt) {
              return sum + dayjs(s.readyAt).diff(s.createdAt, 'minutes');
            }
            return sum;
          }, 0);
          hourData.avgWaitTime = Math.round(totalWait / hourSessions.length);
        }
      });

      // Find peak hours
      const peakHours = hourlyActivity
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map(h => h.hour);

      const stats: QueueStats = {
        notariaId,
        timestamp: new Date(),
        totalSessions,
        waitingSessions,
        activeSessions,
        readySessions,
        completedToday,
        averageWaitTime: waitTimes.length > 0 
          ? Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length) 
          : 0,
        averageServiceTime: serviceTimes.length > 0
          ? Math.round(serviceTimes.reduce((a, b) => a + b, 0) / serviceTimes.length)
          : 20,
        longestWaitTime: waitTimes.length > 0 ? Math.max(...waitTimes) : 0,
        shortestWaitTime: waitTimes.length > 0 ? Math.min(...waitTimes) : 0,
        tramiteTypeDistribution,
        priorityDistribution,
        hourlyActivity,
        peakHours
      };

      // Cache stats for 2 minutes
      if (this.cache) {
        await this.cache.set(cacheKey, stats, 120);
      }

      return stats;

    } catch (error) {
      this.logger.error('Failed to get queue stats', {
        error: error instanceof Error ? error.message : error,
        notariaId
      });
      
      // Return basic stats on error
      return {
        notariaId,
        timestamp: new Date(),
        totalSessions: 0,
        waitingSessions: 0,
        activeSessions: 0,
        readySessions: 0,
        completedToday: 0,
        averageWaitTime: 0,
        averageServiceTime: 20,
        longestWaitTime: 0,
        shortestWaitTime: 0,
        tramiteTypeDistribution: {},
        priorityDistribution: {},
        hourlyActivity: [],
        peakHours: []
      };
    }
  }

  /**
   * Cleanup expired sessions
   */
  async cleanupExpired(notariaId?: string): Promise<number> {
    try {
      const where: any = {
        status: { not: 'COMPLETED' },
        expiresAt: { lt: new Date() }
      };

      if (notariaId) {
        where.notariaId = notariaId;
      }

      // Get expired sessions
      const expiredSessions = await this.prisma.activeSession.findMany({
        where,
        select: { id: true, notariaId: true }
      });

      if (expiredSessions.length === 0) {
        return 0;
      }

      // Update to expired status
      const { count } = await this.prisma.activeSession.updateMany({
        where: { id: { in: expiredSessions.map(s => s.id) } },
        data: {
          status: 'EXPIRED',
          updatedAt: new Date()
        }
      });

      // Clear caches for affected notarias
      if (this.cache) {
        const notarias = [...new Set(expiredSessions.map(s => s.notariaId))];
        for (const notaria of notarias) {
          await this.cache.del(CACHE_KEYS.QUEUE(notaria));
          await this.updatePositions(notaria);
        }
      }

      this.logger.info('Cleaned up expired sessions', {
        count,
        notariaId
      });

      return count;

    } catch (error) {
      this.logger.error('Failed to cleanup expired sessions', {
        error: error instanceof Error ? error.message : error,
        notariaId
      });
      return 0;
    }
  }

  // Private helper methods

  private async calculateNextPosition(
    notariaId: string,
    priority: PriorityLevel,
    tramiteType: TramiteType
  ): Promise<number> {
    // Count sessions with higher priority or same priority but earlier creation
    const sessionsAhead = await this.prisma.activeSession.count({
      where: {
        notariaId,
        status: { in: ['WAITING', 'READY'] },
        OR: [
          {
            priority: {
              in: this.getHigherPriorities(priority)
            }
          }
        ]
      }
    });

    return sessionsAhead + 1;
  }

  private getHigherPriorities(priority: PriorityLevel): PriorityLevel[] {
    const priorities: PriorityLevel[] = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'];
    const currentIndex = priorities.indexOf(priority);
    return priorities.slice(currentIndex + 1);
  }

  private applySortingLogic(sessions: ActiveSession[]): ActiveSession[] {
    return sessions.sort((a, b) => {
      // First by priority weight (higher weight first)
      const priorityDiff = this.priorityWeights[b.priority] - this.priorityWeights[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by creation time (FIFO for same priority)
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }

  private calculateEstimatedWaitTime(
    position: number,
    allSessions: ActiveSession[]
  ): number {
    // Calculate based on tramite types ahead in queue
    let totalEstimatedTime = 0;
    
    for (let i = 0; i < position; i++) {
      if (allSessions[i]) {
        totalEstimatedTime += this.tramiteTimeEstimates[allSessions[i].tramiteType] || 20;
      }
    }

    return totalEstimatedTime;
  }
}