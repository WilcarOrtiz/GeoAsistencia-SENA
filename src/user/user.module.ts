import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AccessControlModuleModule } from 'src/access-control-module/access-control-module.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ClassGroupsModule } from 'src/class_groups/class_groups.module';
import { AttendanceModule } from 'src/attendance-module/attendance-module.module';
import { User } from './entities/user.entity';
import { StudentModule } from 'src/student/student.module';
import { TeacherModule } from 'src/teacher/teacher.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AccessControlModuleModule),
    AuthModule,
    forwardRef(() => AttendanceModule),
    forwardRef(() => ClassGroupsModule),
    forwardRef(() => StudentModule),
    forwardRef(() => TeacherModule),
  ],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
