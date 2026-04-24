import { ApiProperty } from '@nestjs/swagger';

export class FailedItemDto {
  @ApiProperty({ example: 4 })
  row!: number;

  @ApiProperty({ example: 'PRO234' })
  code!: string;

  @ApiProperty({
    example: ['El código ya está en uso'],
    type: [String],
  })
  errors!: string[];
}

export class BulkCreateResponseDto {
  @ApiProperty({ example: 5 })
  created!: number;

  @ApiProperty({
    type: [FailedItemDto],
  })
  failed!: FailedItemDto[];
}
