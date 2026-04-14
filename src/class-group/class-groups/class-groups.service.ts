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
import { FindAllClaasGroupsDto } from './dto/find-all-classgroup.dto';

@Injectable()
export class ClassGroupsService {
  constructor(
    @InjectRepository(ClassGroup)
    private readonly classGroupRepo: Repository<ClassGroup>,
    private readonly semesterService: SemesterService,
    private readonly subjectService: SubjectsService,
    private readonly teacherService: TeacherService,
  ) {}

  private baseListQuery() {
    return this.classGroupRepo
      .createQueryBuilder('group')
      .leftJoin('group.subject', 'subject')
      .leftJoin('group.semester', 'semester')
      .leftJoin('group.teacher', 'teacher')
      .leftJoin('teacher.user', 'user')
      .leftJoin(
        'group.enrollments',
        'enrollment',
        'enrollment.status = :status',
        {
          status: 'ACTIVE',
        },
      )
      .loadRelationCountAndMap(
        'group.total_students',
        'group.enrollments',
        'enrollment',
        (qb) => qb.where('enrollment.status = :status', { status: 'ACTIVE' }),
      )
      .select([
        'group.id',
        'group.code',
        'group.name',
        'group.academic_year',
        'group.max_students',
        'group.is_active',
        'group.created_at',
        'subject.id',
        'subject.name',
        'semester.id',
        'semester.name',
        'teacher.auth_id',
        'user.first_name',
        'user.middle_name',
        'user.last_name',
        'user.second_last_name',
      ]);
  }

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

  async findAll(options: FindAllClaasGroupsDto) {
    const { limit = 10, page = 1, semester, subject, term } = options;
    const offset = (page - 1) * limit;

    const qb = this.baseListQuery();

    if (semester) {
      qb.andWhere('semester.id = :semesterId', {
        semesterId: semester,
      });
    }

    if (subject) {
      qb.andWhere('subject.id = :subjectId', {
        subjectId: subject,
      });
    }

    if (term) {
      const terms = term.split(' ').filter((t) => t.trim() !== '');

      terms.forEach((word, index) => {
        qb.andWhere(
          `(
    group.code ILIKE :term${index} OR
    group.name ILIKE :term${index} OR
    subject.name ILIKE :term${index} OR
    semester.name ILIKE :term${index} OR
    CONCAT(
      user.first_name, ' ',
      COALESCE(user.middle_name, ''), ' ',
      user.last_name, ' ',
      COALESCE(user.second_last_name, '')
    ) ILIKE :term${index}
  )`,
          { [`term${index}`]: `%${word}%` },
        );
      });
    }

    qb.orderBy('group.created_at', 'DESC').take(limit).skip(offset);

    const [data, total] = await qb.getManyAndCount();
    const mapped = data.map(
      (group: ClassGroup & { total_students?: number }) => ({
        id: group.id,
        code: group.code,
        name: group.name,
        academic_year: group.academic_year,
        max_students: group.max_students,
        total_students: group.total_students ?? 0,
        is_active: group.is_active,
        created_at: group.created_at,

        subject: group.subject
          ? { id: group.subject.id, name: group.subject.name }
          : null,

        semester: group.semester
          ? { id: group.semester.id, name: group.semester.name }
          : null,

        teacher: group.teacher
          ? {
              id: group.teacher.auth_id,
              name: [
                group.teacher.user?.first_name,
                group.teacher.user?.middle_name,
                group.teacher.user?.last_name,
                group.teacher.user?.second_last_name,
              ]
                .filter(Boolean)
                .join(' '),
            }
          : null,
      }),
    );

    return {
      data: mapped,
      total,
      limit,
      page,
    };
  }

  async findOne(id: string) {
    const group = await this.classGroupRepo
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.subject', 'subject')
      .leftJoinAndSelect('group.semester', 'semester')
      .leftJoinAndSelect('group.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .leftJoinAndSelect('group.classDays', 'classDays')
      .where('group.id = :id', { id })
      .getOne();

    if (!group) throw new NotFoundException('Grupo no encontrado');
    return group;
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
}
