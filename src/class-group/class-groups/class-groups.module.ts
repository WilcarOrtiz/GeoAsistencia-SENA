import { Module } from '@nestjs/common';
import { ClassGroupsController } from './class-groups.controller';
import { ClassGroupsService } from './class-groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassGroup } from './entities/class-group.entity';
import { AcademicModule } from 'src/academic/academic.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ClassGroupsController],
  providers: [ClassGroupsService],
  imports: [
    TypeOrmModule.forFeature([ClassGroup]),
    AcademicModule,
    UsersModule,
  ],
  exports: [TypeOrmModule, ClassGroupsService],
})
export class ClassGroupsModule {}
