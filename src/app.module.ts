import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { AccessControlModuleModule } from './access-control-module/access-control-module.module';
import { UserModule } from './user/user.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { SemesterModule } from './semester/semester.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ClassGroupsModule } from './class_groups/class_groups.module';
import { AttendanceModule } from './attendance-module/attendance-module.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
      synchronize: true,
    }),
    CommonModule,
    SeedModule,
    AccessControlModuleModule,
    UserModule,
    SupabaseModule,
    AuthModule,
    SemesterModule,
    SubjectsModule,
    ClassGroupsModule,
    AttendanceModule,
    StudentModule,
    TeacherModule,
  ],
  providers: [],
})
export class AppModule {}
