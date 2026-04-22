import { Module } from '@nestjs/common';
import { EnrollmentService } from './service/enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { Enrollment } from './entities/enrollment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassGroupsModule } from '../class-groups/class-groups.module';
import { EnrollmentBulkService } from './service/enrollment-bulk.service';

@Module({
  controllers: [EnrollmentController],
  providers: [EnrollmentService, EnrollmentBulkService],
  imports: [TypeOrmModule.forFeature([Enrollment]), ClassGroupsModule],
  exports: [TypeOrmModule, EnrollmentService],
})
export class EnrollmentModule {}
