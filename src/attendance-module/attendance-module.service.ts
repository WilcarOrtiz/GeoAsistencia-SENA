import { Injectable } from '@nestjs/common';
import { CreateAttendanceModuleDto } from './dto/create-attendance-module.dto';
import { UpdateAttendanceModuleDto } from './dto/update-attendance-module.dto';

@Injectable()
export class AttendanceModuleService {
  create(createAttendanceModuleDto: CreateAttendanceModuleDto) {
    return 'This action adds a new attendanceModule';
  }

  findAll() {
    return `This action returns all attendanceModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendanceModule`;
  }

  update(id: number, updateAttendanceModuleDto: UpdateAttendanceModuleDto) {
    return `This action updates a #${id} attendanceModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendanceModule`;
  }
}
