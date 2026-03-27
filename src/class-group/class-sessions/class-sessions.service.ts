import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ClassSessions } from './entities/class-session.entity';

@Injectable()
export class ClassSessionsService {
  constructor(
    @InjectRepository(ClassSessions)
    private readonly classGroupRepo: Repository<ClassSessions>,
  ) {}

  async removeSeed(manager: EntityManager): Promise<void> {
    const repo = manager.getRepository(ClassSessions);
    await repo.createQueryBuilder().delete().execute();
  }
}
