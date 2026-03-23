import { Module } from '@nestjs/common';
import { SubjectsController } from './subjects/subjects.controller';
import { SubjectsService } from './subjects/subjects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemesterController } from './semester/semester.controller';
import { SemesterService } from './semester/semester.service';
import { Semester } from './semester/entities/semester.entity';
import { Subject } from './subjects/entities/subject.entity';

@Module({
  controllers: [SubjectsController, SemesterController],
  providers: [SubjectsService, SemesterService],
  imports: [TypeOrmModule.forFeature([Subject, Semester])],
  exports: [TypeOrmModule, SubjectsService, SemesterService],
})
export class AcademicModule {}
