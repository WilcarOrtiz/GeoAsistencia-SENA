import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FindAllUsersDto extends PaginationDto {
  @ApiPropertyOptional({})
  @IsOptional()
  roleId?: string;
}
