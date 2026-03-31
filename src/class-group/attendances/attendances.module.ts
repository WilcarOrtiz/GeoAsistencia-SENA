import { Module } from '@nestjs/common';
import { AttendancesController } from './attendances.controller';
import { AttendancesService } from './attendances.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { ClassSessions } from '../class-sessions/entities/class-session.entity';

@Module({
  controllers: [AttendancesController],
  providers: [AttendancesService],
  imports: [TypeOrmModule.forFeature([Attendance, ClassSessions])],
  exports: [TypeOrmModule, AttendancesService],
})
export class AttendancesModule {}
