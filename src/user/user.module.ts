import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { AccessControlModuleModule } from 'src/access-control-module/access-control-module.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAuthService } from './service/user-auth.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserAuthService],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AccessControlModuleModule),
  ],
  exports: [TypeOrmModule],
})
export class UserModule {}
