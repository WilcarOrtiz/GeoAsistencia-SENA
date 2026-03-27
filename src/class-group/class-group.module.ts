import { Module } from '@nestjs/common';
import { ClassSessionsModule } from './class-sessions/class-sessions.module';
import { AttendancesModule } from './attendances/attendances.module';
import { ClassDaysModule } from './class-days/class-days.module';
import { ClassGroupsModule } from './class-groups/class-groups.module';
import { EnrollmentModule } from './enrollment/enrollment.module';

@Module({
  imports: [
    AttendancesModule,
    ClassDaysModule,
    ClassGroupsModule,
    ClassSessionsModule,
    EnrollmentModule,
  ],
  exports: [
    AttendancesModule,
    ClassDaysModule,
    ClassGroupsModule,
    ClassSessionsModule,
    EnrollmentModule,
  ],
})
export class ClassGroupModule {}
