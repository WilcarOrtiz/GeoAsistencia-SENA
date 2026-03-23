import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassDaysService } from './class-days.service';
import { CreateClassDayDto } from './dto/create-class-day.dto';
import { UpdateClassDayDto } from './dto/update-class-day.dto';

@Controller('class-days')
export class ClassDaysController {
  constructor(private readonly classDaysService: ClassDaysService) {}

  @Post()
  create(@Body() createClassDayDto: CreateClassDayDto) {
    return this.classDaysService.create(createClassDayDto);
  }

  @Get()
  findAll() {
    return this.classDaysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classDaysService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClassDayDto: UpdateClassDayDto,
  ) {
    return this.classDaysService.update(+id, updateClassDayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classDaysService.remove(+id);
  }
}
