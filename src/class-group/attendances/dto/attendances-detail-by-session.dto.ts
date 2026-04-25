import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class SessionStudentDto {
  @ApiProperty({ example: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'María García López' })
  @Expose()
  name!: string;
}

export class SessionAttendanceDetailDto {
  @ApiProperty({ example: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'PRESENT' })
  @Expose()
  status!: string;

  @ApiProperty({ example: '14:10:00', nullable: true })
  @Expose()
  check_in_time!: string | null;

  @ApiProperty({ type: SessionStudentDto })
  @Expose()
  @Type(() => SessionStudentDto)
  student!: SessionStudentDto;
}
