import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassGroupsService } from './class_groups.service';
import { CreateClassGroupDto } from './dto/create-class_group.dto';
import { UpdateClassGroupDto } from './dto/update-class_group.dto';

@Controller('class-groups')
export class ClassGroupsController {
  constructor(private readonly classGroupsService: ClassGroupsService) {}

  @Post()
  create(@Body() createClassGroupDto: CreateClassGroupDto) {
    return this.classGroupsService.create(createClassGroupDto);
  }

  @Get()
  findAll() {
    return this.classGroupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classGroupsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClassGroupDto: UpdateClassGroupDto,
  ) {
    return this.classGroupsService.update(+id, updateClassGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classGroupsService.remove(+id);
  }
}
