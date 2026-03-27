import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassGroupDto } from './dto/create-class-group.dto';
import { ClassGroup } from './entities/class-group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { SemesterService } from 'src/academic/semester/semester.service';
import { SubjectsService } from 'src/academic/subjects/subjects.service';
import { TeacherService } from 'src/users/teacher/teacher.service';

@Injectable()
export class ClassGroupsService {
  constructor(
    @InjectRepository(ClassGroup)
    private readonly classGroupRepo: Repository<ClassGroup>,
    private readonly semesterService: SemesterService,
    private readonly subjectService: SubjectsService,
    private readonly teacherService: TeacherService,
  ) {}

  async create(createClassGroupDto: CreateClassGroupDto): Promise<ClassGroup> {
    const { code, name, subject_id, semester_id, teacher_id, max_students } =
      createClassGroupDto;

    const existing = await this.classGroupRepo.findOne({ where: { code } });
    if (existing) {
      throw new BadRequestException(
        `Ya existe un grupo de clase con ese codigo - ${code}`,
      );
    }

    const subject = await this.subjectService.findOne(subject_id);
    const semester =
      await this.semesterService.findActiveOrPlanned(semester_id);
    const teacher = await this.teacherService.findActiveTeacher(teacher_id);

    const classGroup = this.classGroupRepo.create({
      code,
      subject,
      semester,
      teacher,
      max_students,
      name,
      academic_year: semester.academic_year,
    });

    return await this.classGroupRepo.save(classGroup);
  }

  async findActiveGroup(id: string): Promise<ClassGroup> {
    const classgroup = await this.classGroupRepo.findOneBy({
      id,
      is_active: true,
    });

    if (!classgroup)
      throw new BadRequestException(
        'El grupo de clase no existe o no se encuentra activo',
      );
    return classgroup;
  }

  async removeSeed(manager: EntityManager): Promise<void> {
    const repo = manager.getRepository(ClassGroup);
    await repo.createQueryBuilder().delete().execute();
  }

  async findActiveGroupWithSubject(id: string): Promise<ClassGroup> {
    const classgroup = await this.classGroupRepo.findOne({
      where: { id, is_active: true },
      relations: ['subject'],
    });

    if (!classgroup) {
      throw new NotFoundException(
        'El grupo de clase no existe o no está activo',
      );
    }

    return classgroup;
  }

  /* async findOne(term: string): Promise<ClassGroup> {
    const classgroup = isUUID(term)
      ? await this.classGroupRepo.findOneBy({ id: term, is_active: true })
      : await this.classGroupRepo
          .createQueryBuilder('classgroup')
          .where(
            '(classgroup.code = :term OR classgroup.name = :term) AND classgroup.is_active = true',
            { term },
          )
          .getOne();

    if (!classgroup)
      throw new NotFoundException(`Grupo de clase no encontrado`);
    return classgroup;
  }*/
}
