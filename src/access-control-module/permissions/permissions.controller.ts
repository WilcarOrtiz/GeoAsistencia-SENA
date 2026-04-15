import { Controller, Get, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import {
  PaginatedResponseDto,
  PaginationDto,
} from 'src/common/dtos/pagination.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { PublicAccess } from 'src/common/decorators';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { toPaginatedDto } from 'src/common/utils/dto-mapper.util';

@ApiBearerAuth('access-token')
@PublicAccess()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('matrix')
  @ApiOperation({
    summary: 'Listar permisos',
  })
  @ApiOkResponse({
    description: 'Lista los permisos para ser usado en la matrix de roles',
  })
  async findAllForMatrix(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<PermissionResponseDto>> {
    const result = await this.permissionsService.findAll({
      pagination: paginationDto,
      withRoles: true,
    });

    return toPaginatedDto(PermissionResponseDto, result);
  }
}
