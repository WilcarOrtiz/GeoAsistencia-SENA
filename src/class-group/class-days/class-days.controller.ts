import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ClassDaysService } from './class-days.service';
import { CreateClassDayDto } from './dto/create-class-day.dto';
import { ClassDayResponseDto } from './dto/class-day-response.dto';
import { toDto } from 'src/common/utils/dto-mapper.util';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/common/guard';
import { RequiredPermissions } from 'src/common/decorators';
import { PERMISSIONS } from 'src/common/constants/permisos';

@Controller('class-days')
export class ClassDaysController {
  constructor(private readonly classDaysService: ClassDaysService) {}

  //TODO: MOVIL
  @Get('group/:id')
  @ApiOperation({
    summary: 'Obtener dias de clase de un grupo',
  })
  @ApiOkResponse({
    type: ClassDayResponseDto,
    isArray: true,
  })
  async findByGroup(@Param('id', ParseUUIDPipe) id: string) {
    return toDto(
      ClassDayResponseDto,
      await this.classDaysService.findByGroup(id),
    );
  }

  @Patch(':id/deactivate')
  @RequiredPermissions(PERMISSIONS.GESTIONAR_HORARIOS)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Elimianr un dia de clase',
  })
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.classDaysService.deactivate(id);
  }

  @Post()
  @RequiredPermissions(PERMISSIONS.GESTIONAR_HORARIOS)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Registrar dia de clase',
  })
  @ApiOkResponse({ type: ClassDayResponseDto })
  async create(@Body() createClassDayDto: CreateClassDayDto) {
    return await this.classDaysService.create(createClassDayDto);
  }
}
