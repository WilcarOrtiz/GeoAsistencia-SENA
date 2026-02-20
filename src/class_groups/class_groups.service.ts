import { Injectable } from '@nestjs/common';
import { CreateClassGroupDto } from './dto/create-class_group.dto';
import { UpdateClassGroupDto } from './dto/update-class_group.dto';

@Injectable()
export class ClassGroupsService {
  create(createClassGroupDto: CreateClassGroupDto) {
    return 'This action adds a new classGroup';
  }

  findAll() {
    return `This action returns all classGroups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classGroup`;
  }

  update(id: number, updateClassGroupDto: UpdateClassGroupDto) {
    return `This action updates a #${id} classGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} classGroup`;
  }
}
