import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { AccessControlModuleModule } from 'src/access-control-module/access-control-module.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './entities/user.entity';
import { UserProfileService } from './service/user-profile.service';
import { UserBulkService } from './service/user-bulk.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserProfileService, UserBulkService],
  imports: [
    TypeOrmModule.forFeature([User]),
    AccessControlModuleModule,
    AuthModule,
  ],
  exports: [TypeOrmModule, UserService, UserProfileService],
})
export class UserModule {}
