import { Module } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { SemesterController } from './semester.controller';
import { Semester } from './entities/semester.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SemesterController],
  providers: [SemesterService],
  imports: [TypeOrmModule.forFeature([Semester])],
})
export class SemesterModule {}
