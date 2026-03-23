import { Injectable } from '@nestjs/common';
import { CreateClassDayDto } from './dto/create-class-day.dto';
import { UpdateClassDayDto } from './dto/update-class-day.dto';

@Injectable()
export class ClassDaysService {
  create(createClassDayDto: CreateClassDayDto) {
    return 'This action adds a new classDay';
  }

  findAll() {
    return `This action returns all classDays`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classDay`;
  }

  update(id: number, updateClassDayDto: UpdateClassDayDto) {
    return `This action updates a #${id} classDay`;
  }

  remove(id: number) {
    return `This action removes a #${id} classDay`;
  }
}
