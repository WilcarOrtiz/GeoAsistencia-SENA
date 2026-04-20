import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { ClassDaysService } from './class-days.service';
import { CreateClassDayDto } from './dto/create-class-day.dto';
import { ClassDayResponseDto } from './dto/class-day-response.dto';
import { toDto } from 'src/common/utils/dto-mapper.util';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('class-days')
export class ClassDaysController {
  constructor(private readonly classDaysService: ClassDaysService) {}

  @Get('group/:id')
  @ApiOperation({
    summary: 'Obtener dias de clase de un grupo',
  })
  @ApiOkResponse({
    type: ClassDayResponseDto,
    isArray: true,
  })
  async findByGroup(@Param('id') id: string) {
    return toDto(
      ClassDayResponseDto,
      await this.classDaysService.findByGroup(id),
    );
  }

  @Patch(':id/deactivate')
  @ApiOperation({
    summary: 'Elimianr un dia de clase',
  })
  deactivate(@Param('id') id: string) {
    return this.classDaysService.deactivate(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Registrar dia de clase',
  })
  @ApiOkResponse({ type: ClassDayResponseDto })
  async create(@Body() createClassDayDto: CreateClassDayDto) {
    return await this.classDaysService.create(createClassDayDto);
  }
}
