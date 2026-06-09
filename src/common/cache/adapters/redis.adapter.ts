import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { ICacheService } from '../cache.interface';
import Redis from 'ioredis';

@Injectable()
export class RedisAdapter
  implements ICacheService, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisAdapter.name);
  private client!: Redis;

  onModuleInit() {
    this.client = new Redis(process.env.REDIS_URL!, {
      lazyConnect: false,
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
    });

    this.client.on('connect', () => this.logger.log('Redis conectado'));
    this.client.on('error', (err) => this.logger.error('Redis error', err));
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  getClient(): Redis {
    return this.client;
  }

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    if (raw === null) {
      this.logger.debug(`[MISS] ${key}`);
      return null;
    }
    this.logger.debug(`[HIT]  ${key}`);
    return JSON.parse(raw) as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, serialized, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, serialized);
    }
    this.logger.debug(`[SET]  ${key} TTL:${ttlSeconds ?? '∞'}s`);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
    this.logger.debug(`[DEL]  ${key}`);
  }

  async delByPrefix(prefix: string): Promise<void> {
    const pattern = `${prefix}*`;
    let cursor = '0';
    const toDelete: string[] = [];

    do {
      const [next, keys] = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = next;
      toDelete.push(...keys);
    } while (cursor !== '0');

    if (toDelete.length === 0) {
      this.logger.debug(`[DEL_PREFIX] Sin claves para "${pattern}"`);
      return;
    }

    // DEL acepta múltiples keys en un solo round-trip
    await this.client.del(...toDelete);
    this.logger.debug(
      `[DEL_PREFIX] "${pattern}" → ${toDelete.length} clave(s)`,
    );
  }
}
