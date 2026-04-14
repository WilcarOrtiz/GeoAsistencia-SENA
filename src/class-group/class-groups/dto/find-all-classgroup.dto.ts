import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FindAllClaasGroupsDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  term?: string; // referente a codigo o al name

  @ApiPropertyOptional({ example: 'semestre-2016' })
  @IsOptional()
  @IsString()
  semester?: string;

  @ApiPropertyOptional({ example: 'base de datos' })
  @IsOptional()
  @IsString()
  subject?: string;
}
