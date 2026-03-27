import { Module } from '@nestjs/common';
import { ClassSessionsService } from './class-sessions.service';
import { ClassSessions } from './entities/class-session.entity';
import { ClassSessionsController } from './class-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ClassSessionsController],
  providers: [ClassSessionsService],
  imports: [TypeOrmModule.forFeature([ClassSessions])],
  exports: [TypeOrmModule, ClassSessionsService],
})
export class ClassSessionsModule {}
