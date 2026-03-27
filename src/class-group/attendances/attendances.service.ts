import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
  ) {}

  async removeSeed(manager: EntityManager): Promise<void> {
    const repo = manager.getRepository(Attendance);
    await repo.createQueryBuilder().delete().execute();
  }
}
