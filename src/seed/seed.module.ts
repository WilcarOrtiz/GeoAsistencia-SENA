import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AccessControlModuleModule } from 'src/access-control-module/access-control-module.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [AccessControlModuleModule, UserModule],
})
export class SeedModule {}
