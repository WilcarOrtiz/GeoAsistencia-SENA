import { Controller, Post, Body } from '@nestjs/common';
import { ClassGroupsService } from './class-groups.service';
import { CreateClassGroupDto } from './dto/create-class-group.dto';
import { PublicAccess } from 'src/common/decorators';

@PublicAccess()
@Controller('class-groups')
export class ClassGroupsController {
  constructor(private readonly classGroupsService: ClassGroupsService) {}

  @Post()
  create(@Body() createClassGroupDto: CreateClassGroupDto) {
    return this.classGroupsService.create(createClassGroupDto);
  }
}
