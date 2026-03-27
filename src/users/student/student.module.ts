import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [TypeOrmModule.forFeature([Student])],
  exports: [TypeOrmModule, StudentService],
})
export class StudentModule {}
