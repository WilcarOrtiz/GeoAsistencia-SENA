import { forwardRef, Module } from '@nestjs/common';
import { AttendanceModuleService } from './attendance-module.service';
import { AttendanceModuleController } from './attendance-module.controller';
import { Attendance, ClassSessions } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassGroupsModule } from 'src/class_groups/class_groups.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AttendanceModuleController],
  providers: [AttendanceModuleService],
  imports: [
    TypeOrmModule.forFeature([Attendance, ClassSessions]),
    forwardRef(() => ClassGroupsModule),
    forwardRef(() => UserModule),
  ],
  exports: [TypeOrmModule, AttendanceModuleService],
})
export class AttendanceModule {}
