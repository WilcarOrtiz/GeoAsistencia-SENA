import { Controller, Get, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { PublicAccess } from 'src/common/decorators';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { plainToInstance } from 'class-transformer';

@ApiBearerAuth('access-token')
@PublicAccess()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('matrix')
  @ApiOperation({
    summary: 'Listado de permisos para matriz de roles',
    description:
      'Obtiene un listado paginado de permisos, incluyendo sus roles asociados, para ser utilizados en una vista tipo matriz (roles vs permisos).',
  })
  @ApiOkResponse({
    type: [PermissionResponseDto],
  })
  async findAllForMatrix(
    @Query() paginationDto: PaginationDto,
  ): Promise<PermissionResponseDto[]> {
    const permissions = await this.permissionsService.find({
      pagination: paginationDto,
      withRoles: true,
    });

    return plainToInstance(PermissionResponseDto, permissions, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
