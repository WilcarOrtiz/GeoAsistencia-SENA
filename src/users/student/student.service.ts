import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async removeSeed(manager: EntityManager): Promise<void> {
    const repo = manager.getRepository(Student);
    await repo.createQueryBuilder().delete().execute();
  }
}
