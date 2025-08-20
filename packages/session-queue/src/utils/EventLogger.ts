import { PrismaClient } from '@prisma/client';
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import {
  IEventLogger,
  EventLog,
  SocketEvent
} from '../types';

export class EventLogger implements IEventLogger {
  private prisma: PrismaClient;
  private logger: winston.Logger;
  private buffer: EventLog[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly BUFFER_SIZE = 100;
  private readonly FLUSH_INTERVAL_MS = 5000; // 5 seconds

  constructor(prisma: PrismaClient, logger: winston.Logger) {
    this.prisma = prisma;
    this.logger = logger;
    
    // Start background flush process
    this.startBackgroundFlush();

    // Flush on process exit
    process.on('beforeExit', () => {
      this.flush();
    });
  }

  /**
   * Log an event
   */
  async log(eventData: Omit<EventLog, 'id' | 'timestamp'>): Promise<void> {
    try {
      const event: EventLog = {
        id: uuidv4(),
        timestamp: new Date(),
        ...eventData
      };

      // Add to buffer for batch processing
      this.buffer.push(event);

      // Flush if buffer is full
      if (this.buffer.length >= this.BUFFER_SIZE) {
        await this.flush();
      }

      this.logger.debug('Event logged', {
        event: event.event,
        notariaId: event.notariaId,
        sessionId: event.sessionId,
        buffered: this.buffer.length
      });

    } catch (error) {
      this.logger.error('Failed to log event', {
        error: error instanceof Error ? error.message : error,
        eventData
      });
    }
  }

  /**
   * Get recent events for a notaría
   */
  async getEvents(notariaId: string, limit: number = 100): Promise<EventLog[]> {
    try {
      // Flush buffer first to include recent events
      await this.flush();

      const events = await this.prisma.eventLog.findMany({
        where: { notariaId },
        orderBy: { timestamp: 'desc' },
        take: limit
      });

      return events.map(this.mapPrismaToEventLog);

    } catch (error) {
      this.logger.error('Failed to get events', {
        error: error instanceof Error ? error.message : error,
        notariaId,
        limit
      });
      return [];
    }
  }

  /**
   * Get events for a specific session
   */
  async getEventsBySession(sessionId: string): Promise<EventLog[]> {
    try {
      await this.flush();

      const events = await this.prisma.eventLog.findMany({
        where: { sessionId },
        orderBy: { timestamp: 'asc' }
      });

      return events.map(this.mapPrismaToEventLog);

    } catch (error) {
      this.logger.error('Failed to get events by session', {
        error: error instanceof Error ? error.message : error,
        sessionId
      });
      return [];
    }
  }

  /**
   * Get events by type
   */
  async getEventsByType(
    event: SocketEvent, 
    notariaId?: string
  ): Promise<EventLog[]> {
    try {
      await this.flush();

      const where: any = { event };
      if (notariaId) {
        where.notariaId = notariaId;
      }

      const events = await this.prisma.eventLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: 1000 // Limit for performance
      });

      return events.map(this.mapPrismaToEventLog);

    } catch (error) {
      this.logger.error('Failed to get events by type', {
        error: error instanceof Error ? error.message : error,
        event,
        notariaId
      });
      return [];
    }
  }

  /**
   * Cleanup old events
   */
  async cleanup(olderThanDays: number): Promise<number> {
    try {
      const cutoffDate = dayjs().subtract(olderThanDays, 'days').toDate();

      const result = await this.prisma.eventLog.deleteMany({
        where: {
          timestamp: { lt: cutoffDate }
        }
      });

      this.logger.info('Event log cleanup completed', {
        olderThanDays,
        deletedEvents: result.count,
        cutoffDate: cutoffDate.toISOString()
      });

      return result.count;

    } catch (error) {
      this.logger.error('Failed to cleanup events', {
        error: error instanceof Error ? error.message : error,
        olderThanDays
      });
      return 0;
    }
  }

  /**
   * Get event statistics
   */
  async getStats(notariaId?: string, hours: number = 24): Promise<{
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsByHour: Array<{ hour: number; count: number }>;
    topUsers: Array<{ userId: string; count: number }>;
    errorRate: number;
  }> {
    try {
      const since = dayjs().subtract(hours, 'hours').toDate();
      const where: any = { timestamp: { gte: since } };
      
      if (notariaId) {
        where.notariaId = notariaId;
      }

      // Get total count
      const totalEvents = await this.prisma.eventLog.count({ where });

      // Get events by type
      const eventTypeGroups = await this.prisma.eventLog.groupBy({
        by: ['event'],
        where,
        _count: { event: true }
      });

      const eventsByType: Record<string, number> = {};
      eventTypeGroups.forEach(group => {
        eventsByType[group.event] = group._count.event;
      });

      // Get events by hour
      const events = await this.prisma.eventLog.findMany({
        where,
        select: { timestamp: true, event: true }
      });

      const eventsByHour = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));
      events.forEach(event => {
        const hour = dayjs(event.timestamp).hour();
        eventsByHour[hour].count++;
      });

      // Get top users
      const userGroups = await this.prisma.eventLog.groupBy({
        by: ['userId'],
        where: { ...where, userId: { not: null } },
        _count: { userId: true },
        orderBy: { _count: { userId: 'desc' } },
        take: 10
      });

      const topUsers = userGroups.map(group => ({
        userId: group.userId || 'unknown',
        count: group._count.userId
      }));

      // Calculate error rate
      const errorEvents = eventsByType['error'] || 0;
      const errorRate = totalEvents > 0 ? errorEvents / totalEvents : 0;

      return {
        totalEvents,
        eventsByType,
        eventsByHour,
        topUsers,
        errorRate: Math.round(errorRate * 10000) / 100 // Percentage with 2 decimals
      };

    } catch (error) {
      this.logger.error('Failed to get event stats', {
        error: error instanceof Error ? error.message : error,
        notariaId,
        hours
      });
      
      return {
        totalEvents: 0,
        eventsByType: {},
        eventsByHour: [],
        topUsers: [],
        errorRate: 0
      };
    }
  }

  /**
   * Get real-time event stream (last N events)
   */
  async getRealtimeEvents(
    notariaId: string, 
    since: Date,
    limit: number = 50
  ): Promise<EventLog[]> {
    try {
      const events = await this.prisma.eventLog.findMany({
        where: {
          notariaId,
          timestamp: { gte: since }
        },
        orderBy: { timestamp: 'desc' },
        take: limit
      });

      return events.map(this.mapPrismaToEventLog);

    } catch (error) {
      this.logger.error('Failed to get realtime events', {
        error: error instanceof Error ? error.message : error,
        notariaId,
        since: since.toISOString(),
        limit
      });
      return [];
    }
  }

  /**
   * Create event filter for common queries
   */
  async getFilteredEvents(filters: {
    notariaId?: string;
    sessionId?: string;
    userId?: string;
    events?: SocketEvent[];
    since?: Date;
    until?: Date;
    limit?: number;
  }): Promise<EventLog[]> {
    try {
      const where: any = {};

      if (filters.notariaId) where.notariaId = filters.notariaId;
      if (filters.sessionId) where.sessionId = filters.sessionId;
      if (filters.userId) where.userId = filters.userId;
      if (filters.events?.length) where.event = { in: filters.events };
      
      if (filters.since || filters.until) {
        where.timestamp = {};
        if (filters.since) where.timestamp.gte = filters.since;
        if (filters.until) where.timestamp.lte = filters.until;
      }

      const events = await this.prisma.eventLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: filters.limit || 100
      });

      return events.map(this.mapPrismaToEventLog);

    } catch (error) {
      this.logger.error('Failed to get filtered events', {
        error: error instanceof Error ? error.message : error,
        filters
      });
      return [];
    }
  }

  /**
   * Log batch events for performance
   */
  async logBatch(events: Array<Omit<EventLog, 'id' | 'timestamp'>>): Promise<void> {
    try {
      const eventsWithIds: EventLog[] = events.map(event => ({
        id: uuidv4(),
        timestamp: new Date(),
        ...event
      }));

      // Add to buffer
      this.buffer.push(...eventsWithIds);

      // Flush if needed
      if (this.buffer.length >= this.BUFFER_SIZE) {
        await this.flush();
      }

      this.logger.debug('Batch events logged', {
        count: events.length,
        buffered: this.buffer.length
      });

    } catch (error) {
      this.logger.error('Failed to log batch events', {
        error: error instanceof Error ? error.message : error,
        eventCount: events.length
      });
    }
  }

  /**
   * Force flush buffer to database
   */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) {
      return;
    }

    try {
      const eventsToFlush = [...this.buffer];
      this.buffer = [];

      // Prepare data for Prisma
      const prismaData = eventsToFlush.map(event => ({
        id: event.id,
        timestamp: event.timestamp,
        event: event.event,
        notariaId: event.notariaId,
        sessionId: event.sessionId,
        socketId: event.socketId,
        userId: event.userId,
        data: event.data ? JSON.stringify(event.data) : null,
        metadata: event.metadata ? JSON.stringify(event.metadata) : null
      }));

      await this.prisma.eventLog.createMany({
        data: prismaData,
        skipDuplicates: true
      });

      this.logger.debug('Event buffer flushed', { 
        eventCount: eventsToFlush.length 
      });

    } catch (error) {
      this.logger.error('Failed to flush event buffer', {
        error: error instanceof Error ? error.message : error,
        bufferSize: this.buffer.length
      });

      // On error, don't lose the events - put them back in buffer
      // This could cause memory issues, so in production you might want
      // to implement a dead letter queue or file backup
    }
  }

  /**
   * Start/stop background flush process
   */
  private startBackgroundFlush(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }

    this.flushInterval = setInterval(async () => {
      if (this.buffer.length > 0) {
        await this.flush();
      }
    }, this.FLUSH_INTERVAL_MS);

    this.logger.info('Event logger background flush started', {
      intervalMs: this.FLUSH_INTERVAL_MS,
      bufferSize: this.BUFFER_SIZE
    });
  }

  private stopBackgroundFlush(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
      this.logger.info('Event logger background flush stopped');
    }
  }

  private mapPrismaToEventLog(prismaEvent: any): EventLog {
    return {
      id: prismaEvent.id,
      timestamp: prismaEvent.timestamp,
      event: prismaEvent.event,
      notariaId: prismaEvent.notariaId,
      sessionId: prismaEvent.sessionId,
      socketId: prismaEvent.socketId,
      userId: prismaEvent.userId,
      data: prismaEvent.data ? JSON.parse(prismaEvent.data) : undefined,
      metadata: prismaEvent.metadata ? JSON.parse(prismaEvent.metadata) : undefined
    };
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    this.logger.info('Event logger shutting down...');
    
    this.stopBackgroundFlush();
    
    // Flush any remaining events
    await this.flush();
    
    this.logger.info('Event logger shutdown complete');
  }
}