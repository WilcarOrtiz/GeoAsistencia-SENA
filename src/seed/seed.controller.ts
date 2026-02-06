import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { PublicAccess } from 'src/common/decorators/public.decorator';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @PublicAccess()
  @Get()
  excutedSEED() {
    return this.seedService.runSeed();
  }
}
