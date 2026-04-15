import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SemesterFullBasicDto } from 'src/academic/semester/dto/semester-response.dto';
import { SubjectFullBasicDto } from 'src/academic/subjects/dto/subject-response.dto';
import { PaginatedResponseDto } from 'src/common/dtos/pagination.dto';
import { TeacherFullBasicDto } from 'src/users/teacher/dto/teacher-response.dto';

export class ClassGroupResponseDto {
  @ApiProperty({ example: 'c7f46d28-2276-4da0-b96a-fba6f442ac0d' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'GR-101' })
  @Expose()
  code!: string;

  @ApiProperty({ example: 'Grupo A' })
  @Expose()
  name!: string;

  @ApiProperty({ example: 2026 })
  @Expose()
  academic_year!: number;

  @ApiProperty({ example: 30 })
  @Expose()
  max_students!: number;

  @ApiProperty({ example: 30 })
  @Expose()
  total_students!: number;

  @ApiProperty({ example: true })
  @Expose()
  is_active!: boolean;

  @ApiProperty({ example: '2026-04-14T01:07:27.026Z' })
  @Expose()
  created_at!: Date;

  @ApiProperty({ type: SubjectFullBasicDto })
  @Expose()
  @Type(() => SubjectFullBasicDto)
  subject!: SubjectFullBasicDto;

  @ApiProperty({ type: SemesterFullBasicDto })
  @Expose()
  @Type(() => SemesterFullBasicDto)
  semester!: SemesterFullBasicDto;

  @ApiProperty({ type: TeacherFullBasicDto })
  @Expose()
  @Type(() => TeacherFullBasicDto)
  teacher!: TeacherFullBasicDto;
}

/*PAGINADO*/
export class PaginatedClassGroupResponseDto extends PaginatedResponseDto<ClassGroupResponseDto> {
  @Expose()
  @Type(() => ClassGroupResponseDto)
  @ApiProperty({ type: [ClassGroupResponseDto] })
  declare data: ClassGroupResponseDto[];
}
