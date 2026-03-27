import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AccessControlModuleModule } from 'src/access-control-module/access-control-module.module';
import { AcademicModule } from 'src/academic/academic.module';
import { UsersModule } from 'src/users/users.module';
import { ClassGroupModule } from 'src/class-group/class-group.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    AccessControlModuleModule,
    AcademicModule,
    UsersModule,
    ClassGroupModule,
  ],
})
export class SeedModule {}
