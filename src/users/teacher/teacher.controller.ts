import { Controller, Get } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('/all-active')
  @ApiOperation({
    summary: 'Listar docentes activos',
  })
  async findAll() {
    return await this.teacherService.findAllActive();
  }
}
