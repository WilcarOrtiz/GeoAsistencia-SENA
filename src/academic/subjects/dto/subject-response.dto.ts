import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SubjectResponseDto {
  @ApiProperty({ example: '32189680-8774-4638-8980-304b4f0b2405' })
  @Expose()
  id: string;

  @ApiProperty({ example: '32189680-8774-4638-8980-304b4f0b2405' })
  @Expose()
  code: string;

  @ApiProperty({ example: 'PRO234' })
  @Expose()
  name: string;

  @Expose()
  @ApiProperty({ example: true })
  is_active: boolean;
}
