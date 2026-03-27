import { Module } from '@nestjs/common';
import { TeacherModule } from './teacher/teacher.module';
import { StudentModule } from './student/student.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [TeacherModule, StudentModule, UserModule],
  exports: [TeacherModule, StudentModule, UserModule],
})
export class UsersModule {}
