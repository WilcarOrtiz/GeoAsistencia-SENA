import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { Teacher } from './entities/teacher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassGroupModule } from 'src/class-group/class-group.module';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService],
  imports: [TypeOrmModule.forFeature([Teacher]), ClassGroupModule],
  exports: [TypeOrmModule, TeacherService],
})
export class TeacherModule {}
