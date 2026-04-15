import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginatedResponseDto } from 'src/common/dtos/pagination.dto';
import { StateSemester } from 'src/common/enums/state_semester.enum';

export class SemesterFullBasicDto {
  @ApiProperty({ example: '8a66fc96-0944-4630-9c64-bc573b2dff0c' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'Semestre - 2026-2' })
  @Expose()
  name!: string;
}

export class SemesterResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @Expose()
  id!: string;

  @ApiProperty({ example: '2025-1' })
  @Expose()
  code!: string;

  @ApiProperty({ example: 'Primer Semestre Academico 2025' })
  @Expose()
  name!: string;

  @ApiProperty({ example: 2025 })
  @Expose({ name: 'academic_year' })
  academicYear!: number;

  @ApiProperty({ example: 1 })
  @Expose()
  term!: number;

  @ApiProperty({ type: Date, example: '2025-01-15' })
  @Expose({ name: 'start_date' })
  startDate!: Date;

  @ApiProperty({ type: Date, example: '2025-06-30' })
  @Expose({ name: 'end_date' })
  endDate!: Date;

  @ApiProperty({ enum: StateSemester, example: StateSemester.ACTIVE })
  @Expose()
  state!: StateSemester;

  @ApiProperty({ example: true })
  @Expose()
  is_active!: boolean;
}

export class PaginatedSemesterResponseDto extends PaginatedResponseDto<SemesterResponseDto> {
  @Expose()
  @Type(() => SemesterResponseDto)
  @ApiProperty({ type: [SemesterResponseDto] })
  declare data: SemesterResponseDto[];
}
