import { forwardRef, Module } from '@nestjs/common';
import { ClassGroupsService } from './class_groups.service';
import { ClassGroupsController } from './class_groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectsModule } from 'src/subjects/subjects.module';
import { SemesterModule } from 'src/semester/semester.module';
import { ClassDays, ClassGroup } from './entities';
import { AttendanceModule } from 'src/attendance-module/attendance-module.module';
import { UserModule } from 'src/user/user.module';
@Module({
  controllers: [ClassGroupsController],
  providers: [ClassGroupsService],
  imports: [
    TypeOrmModule.forFeature([ClassGroup, ClassDays]),
    SubjectsModule,
    SemesterModule,
    forwardRef(() => AttendanceModule),
    forwardRef(() => UserModule),
  ],
  exports: [TypeOrmModule, ClassGroupsService],
})
export class ClassGroupsModule {}
