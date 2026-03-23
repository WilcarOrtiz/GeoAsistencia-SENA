import { Module } from '@nestjs/common';
import { AttendancesController } from './attendances/attendances.controller';
import { ClassDaysController } from './class-days/class-days.controller';
import { ClassSessionsController } from './class-sessions/class-sessions.controller';
import { ClassGroupsController } from './class-groups/class-groups.controller';
import { AttendancesService } from './attendances/attendances.service';
import { ClassDaysService } from './class-days/class-days.service';
import { ClassSessionsService } from './class-sessions/class-sessions.service';
import { ClassGroupsService } from './class-groups/class-groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendances/entities/attendance.entity';
import { ClassDays } from './class-days/entities/class-day.entity';
import { ClassSessions } from './class-sessions/entities/class-session.entity';
import { ClassGroup } from './class-groups/entities/class-group.entity';
import { AcademicModule } from 'src/academic/academic.module';

@Module({
  controllers: [
    AttendancesController,
    ClassDaysController,
    ClassSessionsController,
    ClassGroupsController,
  ],
  providers: [
    AttendancesService,
    ClassDaysService,
    ClassSessionsService,
    ClassGroupsService,
  ],
  imports: [
    AcademicModule,
    TypeOrmModule.forFeature([
      Attendance,
      ClassDays,
      ClassSessions,
      ClassGroup,
    ]),
  ],
  exports: [
    AttendancesService,
    ClassDaysService,
    ClassSessionsService,
    ClassGroupsService,
    TypeOrmModule,
  ],
})
export class ClassGroupModule {}
