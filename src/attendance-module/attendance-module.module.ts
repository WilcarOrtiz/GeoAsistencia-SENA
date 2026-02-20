import { Module } from '@nestjs/common';
import { AttendanceModuleService } from './attendance-module.service';
import { AttendanceModuleController } from './attendance-module.controller';
import { Attendance, ClassSessions } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AttendanceModuleController],
  providers: [AttendanceModuleService],
  imports: [TypeOrmModule.forFeature([Attendance, ClassSessions])],
  exports: [TypeOrmModule, AttendanceModuleService],
})
export class AttendanceModule {}
