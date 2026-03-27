import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { Enrollment } from './entities/enrollment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassGroupsModule } from '../class-groups/class-groups.module';

@Module({
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  imports: [TypeOrmModule.forFeature([Enrollment]), ClassGroupsModule],
  exports: [TypeOrmModule, EnrollmentService],
})
export class EnrollmentModule {}
