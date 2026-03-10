import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { StateSemester } from 'src/common/enums/state_semester.enum';

class ClassGroupSimpleResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'ADSO-2559218' })
  @Expose()
  name: string;
}

export class SemesterResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @Expose()
  id: string;

  @ApiProperty({ example: '2025-1' })
  @Expose()
  code: string;

  @ApiProperty({ example: 'Primer Semestre Academico 2025' })
  @Expose()
  name: string;

  @ApiProperty({ example: 2025 })
  @Expose()
  academic_year: number;

  @ApiProperty({ example: 1 })
  @Expose()
  term: number;

  @ApiProperty({ type: Date, example: '2025-01-15' })
  @Expose()
  start_date: Date;

  @ApiProperty({ type: Date, example: '2025-06-30' })
  @Expose()
  end_date: Date;

  @ApiProperty({ enum: StateSemester, example: StateSemester.ACTIVO })
  @Expose()
  state: StateSemester;

  @ApiProperty({ example: true })
  @Expose()
  is_active: boolean;

  @ApiProperty({ type: [ClassGroupSimpleResponseDto], required: false })
  @Expose()
  @Type(() => ClassGroupSimpleResponseDto)
  classGroups?: ClassGroupSimpleResponseDto[];
}
