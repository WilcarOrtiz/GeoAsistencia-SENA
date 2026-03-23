import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FindAllUsersDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsOptional()
  roleId?: string;
}
