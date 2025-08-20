import { PrismaClient } from '@prisma/client';
import winston from 'winston';
import {
  IConfigManager,
  QueueConfig,
  CACHE_KEYS
} from '../types';
import { ICacheManager } from '../types';
import { DEFAULT_QUEUE_CONFIGS } from '../config';

export class ConfigManager implements IConfigManager {
  private prisma: PrismaClient;
  private logger: winston.Logger;
  private cache?: ICacheManager;

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
   * Get queue configuration for a notaría
   */
  async getQueueConfig(notariaId: string): Promise<QueueConfig> {
    try {
      // Try cache first
      if (this.cache) {
        const cached = await this.cache.get<QueueConfig>(
          CACHE_KEYS.CONFIG(notariaId)
        );
        if (cached) {
          return cached;
        }
      }

      // Try database
      const configRecord = await this.prisma.queueConfig.findUnique({
        where: { notariaId }
      });

      let config: QueueConfig;
      
      if (configRecord) {
        // Parse from database
        config = {
          notariaId: configRecord.notariaId,
          maxConcurrentSessions: configRecord.maxConcurrentSessions,
          sessionTimeoutMinutes: configRecord.sessionTimeoutMinutes,
          readyTimeoutMinutes: configRecord.readyTimeoutMinutes,
          estimatedTimePerTramite: configRecord.estimatedTimePerTramite,
          enablePriorities: configRecord.enablePriorities,
          autoExpireInactive: configRecord.autoExpireInactive,
          notificationSettings: configRecord.notificationSettings as any
        };
      } else {
        // Use default configuration
        config = DEFAULT_QUEUE_CONFIGS[notariaId] || DEFAULT_QUEUE_CONFIGS['DEFAULT'];
        config.notariaId = notariaId;
      }

      // Cache the result
      if (this.cache) {
        await this.cache.set(
          CACHE_KEYS.CONFIG(notariaId),
          config,
          3600 // 1 hour
        );
      }

      return config;

    } catch (error) {
      this.logger.error('Failed to get queue config', {
        error: error instanceof Error ? error.message : error,
        notariaId
      });
      
      // Fallback to default
      const defaultConfig = DEFAULT_QUEUE_CONFIGS[notariaId] || DEFAULT_QUEUE_CONFIGS['DEFAULT'];
      return { ...defaultConfig, notariaId };
    }
  }

  /**
   * Update queue configuration
   */
  async updateQueueConfig(
    notariaId: string, 
    config: Partial<QueueConfig>
  ): Promise<QueueConfig> {
    try {
      this.logger.info('Updating queue config', { notariaId, config });

      // Get current config
      const currentConfig = await this.getQueueConfig(notariaId);
      const updatedConfig = { ...currentConfig, ...config };

      // Update in database
      await this.prisma.queueConfig.upsert({
        where: { notariaId },
        create: {
          notariaId,
          maxConcurrentSessions: updatedConfig.maxConcurrentSessions,
          sessionTimeoutMinutes: updatedConfig.sessionTimeoutMinutes,
          readyTimeoutMinutes: updatedConfig.readyTimeoutMinutes,
          estimatedTimePerTramite: updatedConfig.estimatedTimePerTramite,
          enablePriorities: updatedConfig.enablePriorities,
          autoExpireInactive: updatedConfig.autoExpireInactive,
          notificationSettings: updatedConfig.notificationSettings as any
        },
        update: {
          maxConcurrentSessions: updatedConfig.maxConcurrentSessions,
          sessionTimeoutMinutes: updatedConfig.sessionTimeoutMinutes,
          readyTimeoutMinutes: updatedConfig.readyTimeoutMinutes,
          estimatedTimePerTramite: updatedConfig.estimatedTimePerTramite,
          enablePriorities: updatedConfig.enablePriorities,
          autoExpireInactive: updatedConfig.autoExpireInactive,
          notificationSettings: updatedConfig.notificationSettings as any
        }
      });

      // Clear cache
      if (this.cache) {
        await this.cache.del(CACHE_KEYS.CONFIG(notariaId));
      }

      this.logger.info('Queue config updated successfully', { notariaId });
      return updatedConfig;

    } catch (error) {
      this.logger.error('Failed to update queue config', {
        error: error instanceof Error ? error.message : error,
        notariaId,
        config
      });
      throw error;
    }
  }

  /**
   * Get list of all notarías
   */
  async getNotariaList(): Promise<string[]> {
    try {
      const configs = await this.prisma.queueConfig.findMany({
        select: { notariaId: true }
      });

      const dbNotarias = configs.map(config => config.notariaId);
      const defaultNotarias = Object.keys(DEFAULT_QUEUE_CONFIGS).filter(id => id !== 'DEFAULT');

      // Combine and deduplicate
      const allNotarias = [...new Set([...dbNotarias, ...defaultNotarias])];
      return allNotarias;

    } catch (error) {
      this.logger.error('Failed to get notaria list', {
        error: error instanceof Error ? error.message : error
      });
      
      // Fallback to default notarías
      return Object.keys(DEFAULT_QUEUE_CONFIGS).filter(id => id !== 'DEFAULT');
    }
  }

  /**
   * Check if notaría is active
   */
  async isNotariaActive(notariaId: string): Promise<boolean> {
    try {
      // Check if there are any active sessions
      const activeSessionCount = await this.prisma.activeSession.count({
        where: {
          notariaId,
          status: { in: ['WAITING', 'READY', 'ACTIVE'] }
        }
      });

      // Check if notaría has been configured or used recently
      const hasConfig = await this.prisma.queueConfig.findUnique({
        where: { notariaId }
      });

      const recentActivity = await this.prisma.activeSession.count({
        where: {
          notariaId,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      });

      return activeSessionCount > 0 || !!hasConfig || recentActivity > 0;

    } catch (error) {
      this.logger.error('Failed to check notaria active status', {
        error: error instanceof Error ? error.message : error,
        notariaId
      });
      return false;
    }
  }

  /**
   * Get global configuration
   */
  async getGlobalConfig(): Promise<any> {
    try {
      // Try cache first
      if (this.cache) {
        const cached = await this.cache.get<any>('global_config');
        if (cached) {
          return cached;
        }
      }

      // Get from database or return defaults
      const globalConfig = await this.prisma.globalConfig.findFirst();

      const config = globalConfig?.config || {
        maintenance: false,
        features: {
          enablePriorities: true,
          enableNotifications: true,
          enableAnalytics: true,
          enableQRGeneration: true
        },
        limits: {
          maxSessionsPerNotaria: 100,
          maxConcurrentSessions: 10,
          sessionTimeoutHours: 3
        },
        notifications: {
          reminderIntervals: [10, 5, 2],
          enableSound: true,
          enablePush: true
        }
      };

      // Cache for 30 minutes
      if (this.cache) {
        await this.cache.set('global_config', config, 1800);
      }

      return config;

    } catch (error) {
      this.logger.error('Failed to get global config', {
        error: error instanceof Error ? error.message : error
      });
      
      // Return safe defaults
      return {
        maintenance: false,
        features: {
          enablePriorities: true,
          enableNotifications: true,
          enableAnalytics: false,
          enableQRGeneration: true
        },
        limits: {
          maxSessionsPerNotaria: 50,
          maxConcurrentSessions: 5,
          sessionTimeoutHours: 2
        }
      };
    }
  }

  /**
   * Update global configuration
   */
  async updateGlobalConfig(config: any): Promise<void> {
    try {
      this.logger.info('Updating global config', { config });

      await this.prisma.globalConfig.upsert({
        where: { id: 'global' },
        create: {
          id: 'global',
          config: config as any
        },
        update: {
          config: config as any
        }
      });

      // Clear cache
      if (this.cache) {
        await this.cache.del('global_config');
      }

      this.logger.info('Global config updated successfully');

    } catch (error) {
      this.logger.error('Failed to update global config', {
        error: error instanceof Error ? error.message : error,
        config
      });
      throw error;
    }
  }
}