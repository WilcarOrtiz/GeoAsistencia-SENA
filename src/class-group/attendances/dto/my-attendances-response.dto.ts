import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class MyAttendanceSessionDto {
  @ApiProperty({ example: 'uuid' })
  @Expose()
  session_id!: string;

  @ApiProperty({ example: 'Introducción a NestJS' })
  @Expose()
  class_topic!: string;

  @ApiProperty({ example: '2025-04-20T14:00:00Z' })
  @Expose()
  date!: Date;

  @ApiProperty({ example: 'PRESENT' })
  @Expose()
  status!: string;

  @ApiProperty({ example: '14:10:00', nullable: true })
  @Expose()
  check_in_time!: string | null;
}

export class MyAttendancesResponseDto {
  @ApiProperty({ example: 'uuid' })
  @Expose()
  group_id!: string;

  @ApiProperty({ example: 10 })
  @Expose()
  total_sessions!: number;

  @ApiProperty({ example: 8 })
  @Expose()
  total_present!: number;

  @ApiProperty({ example: 80 })
  @Expose()
  attendance_rate!: number;

  @ApiProperty({ type: [MyAttendanceSessionDto] })
  @Expose()
  @Type(() => MyAttendanceSessionDto)
  sessions!: MyAttendanceSessionDto[];
}
