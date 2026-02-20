import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttendanceModuleService } from './attendance-module.service';
import { CreateAttendanceModuleDto } from './dto/create-attendance-module.dto';
import { UpdateAttendanceModuleDto } from './dto/update-attendance-module.dto';

@Controller('attendance-module')
export class AttendanceModuleController {
  constructor(private readonly attendanceModuleService: AttendanceModuleService) {}

  @Post()
  create(@Body() createAttendanceModuleDto: CreateAttendanceModuleDto) {
    return this.attendanceModuleService.create(createAttendanceModuleDto);
  }

  @Get()
  findAll() {
    return this.attendanceModuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceModuleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendanceModuleDto: UpdateAttendanceModuleDto) {
    return this.attendanceModuleService.update(+id, updateAttendanceModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceModuleService.remove(+id);
  }
}
