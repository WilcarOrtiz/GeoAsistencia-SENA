import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ValidRole } from 'src/common/constants/valid-role.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FindAllUsersDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: ValidRole,
    example: ValidRole.ADMIN,
  })
  @IsOptional()
  @IsEnum(ValidRole, {
    message: 'Rol no válido',
  })
  role?: ValidRole;
}
