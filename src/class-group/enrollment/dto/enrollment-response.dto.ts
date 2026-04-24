import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EnrollmentStatus } from 'src/common/enums/enrollment-status.enum';
import { PaginatedResponseDto } from 'src/common/dtos/pagination.dto';
import { Type } from 'class-transformer';

export class EnrollmentResponseDto {
  @ApiProperty({ example: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'Juan Perez Gomez' })
  @Expose()
  full_name!: string;

  @ApiProperty({
    enum: EnrollmentStatus,
    example: EnrollmentStatus.ACTIVE,
  })
  @Expose()
  enrollment_status!: EnrollmentStatus;

  @ApiProperty({
    example: '2026-04-20T10:00:00.000Z',
  })
  @Expose()
  enrolled_at!: Date;

  @ApiProperty({
    example: 85.5,
    description: 'Porcentaje de asistencia del estudiante en el grupo',
  })
  @Expose()
  attendance_percentage!: number;
}

export class PaginatedEnrollmentResponseDto extends PaginatedResponseDto<EnrollmentResponseDto> {
  @ApiProperty({ type: [EnrollmentResponseDto] })
  @Type(() => EnrollmentResponseDto)
  declare data: EnrollmentResponseDto[];
}
