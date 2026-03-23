import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassSessionsService } from './class-sessions.service';
import { CreateClassSessionDto } from './dto/create-class-session.dto';
import { UpdateClassSessionDto } from './dto/update-class-session.dto';

@Controller('class-sessions')
export class ClassSessionsController {
  constructor(private readonly classSessionsService: ClassSessionsService) {}

  @Post()
  create(@Body() createClassSessionDto: CreateClassSessionDto) {
    return this.classSessionsService.create(createClassSessionDto);
  }

  @Get()
  findAll() {
    return this.classSessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classSessionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassSessionDto: UpdateClassSessionDto) {
    return this.classSessionsService.update(+id, updateClassSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classSessionsService.remove(+id);
  }
}
