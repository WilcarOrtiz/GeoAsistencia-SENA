import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
  ) {}

  async findActiveTeacher(teacherId: string): Promise<Teacher> {
    const teacher = await this.teacherRepo.findOne({
      where: {
        auth_id: teacherId,
        is_active: true,
      },
      relations: ['user'],
    });

    if (!teacher) {
      throw new BadRequestException(
        'El docente no existe o no se encuentra activo',
      );
    }
    return teacher;
  }

  async removeSeed(manager: EntityManager): Promise<void> {
    const repo = manager.getRepository(Teacher);
    await repo.createQueryBuilder().delete().execute();
  }
}
