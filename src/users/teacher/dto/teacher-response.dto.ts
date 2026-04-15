import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TeacherFullBasicDto {
  @ApiProperty({ example: '4cd08025-2d25-4541-8f4c-8803a45389aa' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'Wilcar Daniel Ortiz Colpas' })
  @Expose()
  name!: string;
}
