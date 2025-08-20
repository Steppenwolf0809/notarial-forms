import Redis from 'ioredis';
import winston from 'winston';
import { ICacheManager } from '../types';
import { SESSION_QUEUE_CONFIG } from '../config';

export class CacheManager implements ICacheManager {
  private redis: Redis;
  private logger: winston.Logger;
  private keyPrefix: string;
  private isConnected: boolean = false;

  constructor(logger: winston.Logger, config = SESSION_QUEUE_CONFIG.redis) {
    this.logger = logger;
    this.keyPrefix = config.keyPrefix;

    // Initialize Redis connection
    this.redis = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db,
      retryDelayOnFailover: config.retryDelayOnFailover,
      maxRetriesPerRequest: config.maxRetriesPerRequest,
      lazyConnect: true
    });

    this.setupEventHandlers();
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!this.isConnected) {
        await this.ensureConnection();
      }

      const prefixedKey = this.getPrefixedKey(key);
      const value = await this.redis.get(prefixedKey);

      if (value === null) {
        return null;
      }

      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }

    } catch (error) {
      this.logger.error('Cache get error', {
        key,
        error: error instanceof Error ? error.message : error
      });
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      if (!this.isConnected) {
        await this.ensureConnection();
      }

      const prefixedKey = this.getPrefixedKey(key);
      const serializedValue = typeof value === 'string' 
        ? value 
        : JSON.stringify(value);

      if (ttlSeconds && ttlSeconds > 0) {
        await this.redis.setex(prefixedKey, ttlSeconds, serializedValue);
      } else {
        await this.redis.set(prefixedKey, serializedValue);
      }

      this.logger.debug('Cache set', {
        key,
        ttl: ttlSeconds,
        valueLength: serializedValue.length
      });

    } catch (error) {
      this.logger.error('Cache set error', {
        key,
        ttl: ttlSeconds,
        error: error instanceof Error ? error.message : error
      });
      throw error;
    }
  }

  /**
   * Delete key from cache
   */
  async del(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.ensureConnection();
      }

      const prefixedKey = this.getPrefixedKey(key);
      const deleted = await this.redis.del(prefixedKey);

      this.logger.debug('Cache delete', { key, deleted: deleted > 0 });
      return deleted > 0;

    } catch (error) {
      this.logger.error('Cache delete error', {
        key,
        error: error instanceof Error ? error.message : error
      });
      return false;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.ensureConnection();
      }

      const prefixedKey = this.getPrefixedKey(key);
      const exists = await this.redis.exists(prefixedKey);

      return exists === 1;

    } catch (error) {
      this.logger.error('Cache exists error', {
        key,
        error: error instanceof Error ? error.message : error
      });
      return false;
    }
  }

  /**
   * Get keys matching pattern
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      if (!this.isConnected) {
        await this.ensureConnection();
      }

      const prefixedPattern = this.getPrefixedKey(pattern);
      const keys = await this.redis.keys(prefixedPattern);

      // Remove prefix from returned keys
      return keys.map(key => key.replace(this.keyPrefix, ''));

    } catch (error) {
      this.logger.error('Cache keys error', {
        pattern,
        error: error instanceof Error ? error.message : error
      });
      return [];
    }
  }

  /**
   * Delete all keys matching pattern
   */
  async flushByPattern(pattern: string): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.ensureConnection();
      }

      const keys = await this.keys(pattern);
      if (keys.length === 0) {
        return 0;
      }

      // Add prefix back for deletion
      const prefixedKeys = keys.map(key => this.getPrefixedKey(key));
      const deleted = await this.redis.del(...prefixedKeys);

      this.logger.info('Cache flush by pattern', {
        pattern,
        keysFound: keys.length,
        deleted
      });

      return deleted;

    } catch (error) {
      this.logger.error('Cache flush by pattern error', {
        pattern,
        error: error instanceof Error ? error.message : error
      });
      return 0;
    }
  }

  /**
   * Increment numeric value
   */
  async increment(key: string, by: number = 1): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.ensureConnection();
      }

      const prefixedKey = this.getPrefixedKey(key);
      const newValue = await this.redis.incrby(prefixedKey, by);

      this.logger.debug('Cache increment', { key, by, newValue });
      return newValue;

    } catch (error) {
      this.logger.error('Cache increment error', {
        key,
        by,
        error: error instanceof Error ? error.message : error
      });
      throw error;
    }
  }

  /**
   * Set expiration on key
   */
  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.ensureConnection();
      }

      const prefixedKey = this.getPrefixedKey(key);
      const success = await this.redis.expire(prefixedKey, ttlSeconds);

      return success === 1;

    } catch (error) {
      this.logger.error('Cache expire error', {
        key,
        ttl: ttlSeconds,
        error: error instanceof Error ? error.message : error
      });
      return false;
    }
  }

  /**
   * Get multiple keys at once
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      if (!this.isConnected) {
        await this.ensureConnection();
      }

      if (keys.length === 0) {
        return [];
      }

      const prefixedKeys = keys.map(key => this.getPrefixedKey(key));
      const values = await this.redis.mget(...prefixedKeys);

      return values.map(value => {
        if (value === null) {
          return null;
        }

        try {
          return JSON.parse(value) as T;
        } catch {
          return value as unknown as T;
        }
      });

    } catch (error) {
      this.logger.error('Cache mget error', {
        keyCount: keys.length,
        error: error instanceof Error ? error.message : error
      });
      return keys.map(() => null);
    }
  }

  /**
   * Set multiple key-value pairs
   */
  async mset<T>(keyValuePairs: Record<string, T>): Promise<void> {
    try {
      if (!this.isConnected) {
        await this.ensureConnection();
      }

      const entries = Object.entries(keyValuePairs);
      if (entries.length === 0) {
        return;
      }

      // Flatten to Redis mset format: key1, value1, key2, value2, ...
      const args: string[] = [];
      entries.forEach(([key, value]) => {
        args.push(this.getPrefixedKey(key));
        args.push(typeof value === 'string' ? value : JSON.stringify(value));
      });

      await this.redis.mset(...args);

      this.logger.debug('Cache mset', { keyCount: entries.length });

    } catch (error) {
      this.logger.error('Cache mset error', {
        keyCount: Object.keys(keyValuePairs).length,
        error: error instanceof Error ? error.message : error
      });
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    connected: boolean;
    keyCount: number;
    usedMemory: string;
    totalConnections: number;
    hitRate: number;
  }> {
    try {
      if (!this.isConnected) {
        return {
          connected: false,
          keyCount: 0,
          usedMemory: '0B',
          totalConnections: 0,
          hitRate: 0
        };
      }

      const info = await this.redis.info('stats', 'memory', 'clients');
      const keyCount = await this.redis.dbsize();

      // Parse Redis INFO output
      const parseInfo = (section: string, key: string): string => {
        const match = info.match(new RegExp(`${key}:([^\r\n]+)`));
        return match ? match[1] : '0';
      };

      const keyspaceHits = parseInt(parseInfo('stats', 'keyspace_hits'));
      const keyspaceMisses = parseInt(parseInfo('stats', 'keyspace_misses'));
      const hitRate = keyspaceHits + keyspaceMisses > 0 
        ? keyspaceHits / (keyspaceHits + keyspaceMisses)
        : 0;

      return {
        connected: true,
        keyCount,
        usedMemory: parseInfo('memory', 'used_memory_human'),
        totalConnections: parseInt(parseInfo('clients', 'total_connections_received')),
        hitRate: Math.round(hitRate * 100) / 100
      };

    } catch (error) {
      this.logger.error('Cache stats error', {
        error: error instanceof Error ? error.message : error
      });

      return {
        connected: false,
        keyCount: 0,
        usedMemory: '0B',
        totalConnections: 0,
        hitRate: 0
      };
    }
  }

  /**
   * Clear all cache data
   */
  async flush(): Promise<void> {
    try {
      if (!this.isConnected) {
        await this.ensureConnection();
      }

      await this.redis.flushdb();
      this.logger.warn('Cache flushed - all data cleared');

    } catch (error) {
      this.logger.error('Cache flush error', {
        error: error instanceof Error ? error.message : error
      });
      throw error;
    }
  }

  /**
   * Close cache connection
   */
  async close(): Promise<void> {
    try {
      if (this.isConnected) {
        await this.redis.quit();
        this.isConnected = false;
        this.logger.info('Cache connection closed');
      }
    } catch (error) {
      this.logger.error('Cache close error', {
        error: error instanceof Error ? error.message : error
      });
    }
  }

  // Private methods

  private setupEventHandlers(): void {
    this.redis.on('connect', () => {
      this.isConnected = true;
      this.logger.info('Cache connected to Redis');
    });

    this.redis.on('ready', () => {
      this.logger.info('Cache ready');
    });

    this.redis.on('error', (error) => {
      this.logger.error('Cache Redis error', { error: error.message });
    });

    this.redis.on('close', () => {
      this.isConnected = false;
      this.logger.warn('Cache connection closed');
    });

    this.redis.on('reconnecting', (delay) => {
      this.logger.info('Cache reconnecting', { delay });
    });
  }

  private async ensureConnection(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.redis.connect();
      } catch (error) {
        this.logger.error('Failed to connect to Redis', {
          error: error instanceof Error ? error.message : error
        });
        throw error;
      }
    }
  }

  private getPrefixedKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }
}