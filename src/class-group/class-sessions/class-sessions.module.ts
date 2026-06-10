import { Module, forwardRef } from '@nestjs/common';
import { ClassSessionsService } from './class-sessions.service';
import { ClassSessionsController } from './class-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSessions } from './entities/class-session.entity';
import { ClassDaysModule } from '../class-days/class-days.module';
import { ClassGroupsModule } from '../class-groups/class-groups.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { AttendancesModule } from '../attendances/attendances.module';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { AttendanceGateway } from './attendance.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassSessions]),
    ClassDaysModule,
    ClassGroupsModule,
    EnrollmentModule,
    forwardRef(() => AttendancesModule),
    DashboardModule,
  ],
  controllers: [ClassSessionsController],
  providers: [ClassSessionsService, AttendanceGateway],
  exports: [ClassSessionsService, AttendanceGateway],
})
export class ClassSessionsModule {}
