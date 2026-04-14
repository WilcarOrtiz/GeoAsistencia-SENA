import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginatedResponseDto } from 'src/common/dtos/pagination.dto';

class SubjectDto {
  @ApiProperty({ example: '3a2d67d9-230e-4dc8-9aa9-33864d9b096f' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Sistema De Informacion I' })
  @Expose()
  name: string;
}

class SemesterDto {
  @ApiProperty({ example: '8a66fc96-0944-4630-9c64-bc573b2dff0c' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Semestre - 2026-2' })
  @Expose()
  name: string;
}

class TeacherDto {
  @ApiProperty({ example: '4cd08025-2d25-4541-8f4c-8803a45389aa' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Wilcar Daniel Ortiz Colpas' })
  @Expose()
  name: string;
}

export class ClassGroupResponseDto {
  @ApiProperty({ example: 'c7f46d28-2276-4da0-b96a-fba6f442ac0d' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'GR-101' })
  @Expose()
  code: string;

  @ApiProperty({ example: 'Grupo A' })
  @Expose()
  name: string;

  @ApiProperty({ example: 2026 })
  @Expose()
  academic_year: number;

  @ApiProperty({ example: 30 })
  @Expose()
  max_students: number;

  @ApiProperty({ example: true })
  @Expose()
  is_active: boolean;

  @ApiProperty({ example: '2026-04-14T01:07:27.026Z' })
  @Expose()
  created_at: Date;

  @ApiProperty({ type: SubjectDto })
  @Expose()
  @Type(() => SubjectDto)
  subject: SubjectDto;

  @ApiProperty({ type: SemesterDto })
  @Expose()
  @Type(() => SemesterDto)
  semester: SemesterDto;

  @ApiProperty({ type: TeacherDto })
  @Expose()
  @Type(() => TeacherDto)
  teacher: TeacherDto;
}

/*PAGINADO*/

export class PaginatedClassGroupResponseDto extends PaginatedResponseDto<ClassGroupResponseDto> {
  @Expose()
  @Type(() => ClassGroupResponseDto)
  @ApiProperty({ type: [ClassGroupResponseDto] })
  declare data: ClassGroupResponseDto[];
}
