import { Controller, Get, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import {
  PaginatedResponseDto,
  PaginationDto,
} from 'src/common/dtos/pagination.dto';
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
  })
  @ApiOkResponse({
    description: 'Listado paginado de permisos',
  })
  async findAllForMatrix(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<PermissionResponseDto>> {
    const result = await this.permissionsService.findAll({
      pagination: paginationDto,
      withRoles: true,
    });

    return {
      ...result,
      data: plainToInstance(PermissionResponseDto, result.data, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
  }
}
