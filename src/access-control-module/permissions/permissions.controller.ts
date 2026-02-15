import { Controller, Get, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.permissionsService.find({
      pagination: paginationDto,
      withRoles: true,
    });
  }

  @Get('matrix')
  findAllForMatrix(@Query() paginationDto: PaginationDto) {
    return this.permissionsService.find({
      pagination: paginationDto,
      withRoles: true,
    });
  }
}
