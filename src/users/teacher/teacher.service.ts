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

  async findAllActive() {
    const data = await this.teacherRepo.find({
      where: { is_active: true },
      relations: ['user'],
      select: {
        auth_id: true,
        user: {
          first_name: true,
          middle_name: true,
          last_name: true,
          second_last_name: true,
          ID_user: true,
        },
      },
    });

    const result = data.map((teacher) => ({
      id: teacher.auth_id,
      name: [
        teacher.user.first_name,
        teacher.user.middle_name,
        teacher.user.last_name,
        teacher.user.second_last_name,
      ]
        .filter(Boolean)
        .join(' '),
      document: teacher.user.ID_user,
    }));

    return { data: result };
  }

  async removeSeed(manager: EntityManager): Promise<void> {
    const repo = manager.getRepository(Teacher);
    await repo.createQueryBuilder().delete().execute();
  }
}
