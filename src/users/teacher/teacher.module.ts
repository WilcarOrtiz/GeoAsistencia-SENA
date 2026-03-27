import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { Teacher } from './entities/teacher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService],
  imports: [TypeOrmModule.forFeature([Teacher])],
  exports: [TypeOrmModule, TeacherService],
})
export class TeacherModule {}
