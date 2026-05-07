import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class TeacherFilterDto {
  @IsOptional()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  semesterId?: string;

  @IsOptional()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  class_group_id?: string;

  @ApiProperty({ example: 20 })
  @IsOptional()
  limit?: number;
}
