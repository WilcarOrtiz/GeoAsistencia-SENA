import { Module, forwardRef } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { ClassSessions } from '../class-sessions/entities/class-session.entity';
import { ClassSessionsModule } from '../class-sessions/class-sessions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, ClassSessions]),
    forwardRef(() => ClassSessionsModule),
  ],
  controllers: [AttendancesController],
  providers: [AttendancesService],
  exports: [AttendancesService],
})
export class AttendancesModule {}
