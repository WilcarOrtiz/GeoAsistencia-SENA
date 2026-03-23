import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { ClassGroupModule } from 'src/class-group/class-group.module';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [TypeOrmModule.forFeature([Student]), ClassGroupModule],
  exports: [TypeOrmModule, StudentService],
})
export class StudentModule {}
