import { Module } from '@nestjs/common';
import { ClassSessionsService } from './class-sessions.service';
import { ClassSessions } from './entities/class-session.entity';
import { ClassSessionsController } from './class-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassDaysModule } from '../class-days/class-days.module';
import { ClassGroupsModule } from '../class-groups/class-groups.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { AttendancesModule } from '../attendances/attendances.module';

@Module({
  controllers: [ClassSessionsController],
  providers: [ClassSessionsService],
  imports: [
    TypeOrmModule.forFeature([ClassSessions]),
    ClassDaysModule,
    ClassGroupsModule,
    EnrollmentModule,
    AttendancesModule,
  ],
  exports: [TypeOrmModule, ClassSessionsService],
})
export class ClassSessionsModule {}
