import { Global, Module } from '@nestjs/common';
import { CACHE_SERVICE } from './cache.constants';
import { RedisAdapter } from './adapters/redis.adapter';

@Global()
@Module({
  providers: [
    RedisAdapter,
    {
      provide: CACHE_SERVICE,
      useExisting: RedisAdapter,
    },
  ],
  exports: [CACHE_SERVICE, RedisAdapter],
})
export class CacheInfrastructureModule {}
