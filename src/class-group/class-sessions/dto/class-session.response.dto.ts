import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SessionAttendanceSummaryDto {
  @ApiProperty({ example: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'Introducción a NestJS' })
  @Expose()
  class_topic!: string;

  @ApiProperty({ example: '2025-04-20T14:00:00Z' })
  @Expose()
  date!: Date;

  @ApiProperty({ example: true })
  @Expose()
  is_open!: boolean;

  @ApiProperty({ example: '14:00:00' })
  @Expose()
  attendance_opened_at!: string;

  @ApiProperty({ example: '15:30:00', nullable: true })
  @Expose()
  attendance_closed_at!: string | null;

  @ApiProperty({ example: 25 })
  @Expose()
  total_students!: number;

  @ApiProperty({ example: 22 })
  @Expose()
  total_present!: number;
}

export class CreateSessionResponseDto {
  @ApiProperty({ example: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'uuid' })
  @Expose()
  code_class_session!: string;
}
