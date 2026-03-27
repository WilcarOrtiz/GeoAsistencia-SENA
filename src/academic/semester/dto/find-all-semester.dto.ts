import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { StateSemester } from 'src/common/enums/state_semester.enum';

export class FindAllSemesterDto extends PaginationDto {
  @ApiPropertyOptional({ example: StateSemester.ACTIVE })
  @IsOptional()
  state?: StateSemester;
}
