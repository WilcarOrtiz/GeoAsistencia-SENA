import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { AccessControlModuleModule } from 'src/access-control-module/access-control-module.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './entities/user.entity';
import { UserProfileService } from './service/user-profile.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserProfileService],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AccessControlModuleModule),
    AuthModule,
  ],
  exports: [TypeOrmModule, UserService, UserProfileService],
})
export class UserModule {}

/*Nivel 0 (sin dependencias):
  AuthModule, SemesterModule, SubjectsModule, AccessControlModule

Nivel 1 (dependen solo del nivel 0):
  UserModule → solo Auth + AccessControl
  StudentModule → solo User
  TeacherModule → solo User

Nivel 2 (dependen del nivel 1):
  ClassGroupsModule → Subject + Semester + Teacher

Nivel 3 (dependen del nivel 2):
  AttendanceModule → ClassGroups + Student */
