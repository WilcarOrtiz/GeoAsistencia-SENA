import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginatedResponseDto } from 'src/common/dtos/pagination.dto';

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

export class PaginatedSubjectResponseDto extends PaginatedResponseDto<SubjectResponseDto> {
  @Expose()
  @Type(() => SubjectResponseDto)
  @ApiProperty({ type: [SubjectResponseDto] })
  declare data: SubjectResponseDto[];
}
