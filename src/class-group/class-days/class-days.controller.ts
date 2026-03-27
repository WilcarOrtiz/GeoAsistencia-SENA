import { Controller, Post, Body } from '@nestjs/common';
import { ClassDaysService } from './class-days.service';
import { CreateClassDayDto } from './dto/create-class-day.dto';
import { PublicAccess } from 'src/common/decorators';

@PublicAccess()
@Controller('class-days')
export class ClassDaysController {
  constructor(private readonly classDaysService: ClassDaysService) {}

  @Post()
  create(@Body() createClassDayDto: CreateClassDayDto) {
    return this.classDaysService.create(createClassDayDto);
  }
}
