import { Module } from '@nestjs/common';
import { ClassGroupsService } from './class_groups.service';
import { ClassGroupsController } from './class_groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassDays, ClassGroup } from './entities';

@Module({
  controllers: [ClassGroupsController],
  providers: [ClassGroupsService],
  imports: [TypeOrmModule.forFeature([ClassGroup, ClassDays])],
  exports: [TypeOrmModule, ClassGroupsService],
})
export class ClassGroupsModule {}
