import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from '../entities/enrollment.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { ClassGroupsService } from '../../class-groups/class-groups.service';
import { EnrollmentStatus } from 'src/common/enums/enrollment-status.enum';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
    private readonly classGroupsService: ClassGroupsService,
  ) {}

  async findStudentUuidByIdUser(idUser: string): Promise<string> {
    const result = await this.enrollmentRepo.manager
      .createQueryBuilder()
      .select('u.auth_id', 'auth_id')
      .from('USERS', 'u')
      .innerJoin('STUDENTS', 's', 's.auth_id = u.auth_id')
      .where('u."ID_user" = :idUser', { idUser })
      .andWhere('u.is_active = true')
      .andWhere('s.is_active = true')
      .getRawOne<{ auth_id: string }>();

    if (!result) {
      throw new BadRequestException(
        `Estudiante con ID ${idUser} no encontrado`,
      );
    }

    return result.auth_id;
  }

  private async getActiveStudentIdsByGroup(
    groupId: string,
  ): Promise<Set<string>> {
    const result = await this.enrollmentRepo
      .createQueryBuilder('e')
      .innerJoin('e.student', 's')
      .innerJoin('s.user', 'u')
      .where('e.class_group_id = :groupId', { groupId })
      .andWhere('e.status = :status', { status: EnrollmentStatus.ACTIVE })
      .andWhere('s.is_active = true')
      .andWhere('u.is_active = true')
      .select('s.auth_id', 'auth_id')
      .getRawMany<{ auth_id: string }>();

    return new Set(result.map((r) => r.auth_id));
  }

  private filterNewStudents(
    studentIds: string[],
    existingIds: Set<string>,
  ): string[] {
    return studentIds.filter((id) => !existingIds.has(id));
  }

  private assertHasNewStudents(newIds: string[], message: string): void {
    if (newIds.length === 0) {
      throw new BadRequestException(message);
    }
  }

  private assertCapacity(
    max: number | null,
    current: number,
    incoming: number,
  ): void {
    if (!max) return;

    if (current + incoming > max) {
      throw new BadRequestException(`Sin cupo. Disponible: ${max - current}`);
    }
  }

  private async assertNotDuplicateSubject(
    studentIds: string[],
    subjectId: string,
  ): Promise<void> {
    const count = await this.enrollmentRepo
      .createQueryBuilder('e')
      .innerJoin('e.classGroup', 'cg')
      .innerJoin('e.student', 's')
      .where('s.auth_id IN (:...studentIds)', { studentIds })
      .andWhere('cg.subject_id = :subjectId', { subjectId })
      .andWhere('e.status = :status', { status: EnrollmentStatus.ACTIVE })
      .getCount();

    if (count > 0) {
      throw new BadRequestException(
        'Algunos estudiantes ya están matriculados en esta materia',
      );
    }
  }

  async enrollStudents(
    groupId: string,
    studentIds: string[],
  ): Promise<{ message: string }> {
    const group =
      await this.classGroupsService.findActiveGroupWithSubject(groupId);

    const existingIds = await this.getActiveStudentIdsByGroup(group.id);
    const newIds = this.filterNewStudents(studentIds, existingIds);

    this.assertHasNewStudents(
      newIds,
      'Todos los alumnos ya están matriculados',
    );
    this.assertCapacity(group.max_students, existingIds.size, newIds.length);
    await this.assertNotDuplicateSubject(newIds, group.subject.id);

    const enrollments = newIds.map((studentId) =>
      this.enrollmentRepo.create({
        classGroup: { id: groupId },
        student: { auth_id: studentId },
        status: EnrollmentStatus.ACTIVE,
      }),
    );

    await this.enrollmentRepo.save(enrollments);

    return { message: `${newIds.length} alumno(s) matriculados` };
  }

  async cancelEnrollments(
    groupId: string,
    studentIds: string[],
  ): Promise<{ message: string }> {
    console.log('Entro al proceso ');
    console.log({ groupId, studentIds });
    const group = await this.classGroupsService.findActiveGroup(groupId);

    const existingIds = await this.getActiveStudentIdsByGroup(group.id);

    const idsToCancel = studentIds.filter((id) => existingIds.has(id));
    console.log('info que llega: ', groupId, studentIds);
    if (idsToCancel.length === 0) {
      throw new BadRequestException(
        'Ninguno de los estudiantes está matriculado en este grupo',
      );
    }

    const result = await this.enrollmentRepo.update(
      {
        classGroup: { id: groupId },
        student: { auth_id: In(idsToCancel) },
        status: EnrollmentStatus.ACTIVE,
      },
      {
        status: EnrollmentStatus.WITHDRAWN,
        unenrolled_at: new Date(),
      },
    );

    if (result.affected !== idsToCancel.length) {
      throw new BadRequestException(
        'Algunos estudiantes no pudieron ser cancelados',
      );
    }

    return {
      message: `${result.affected} matrícula(s) cancelada(s)`,
    };
  }

  async moveStudents(
    studentIds: string[],
    fromGroupId: string,
    toGroupId: string,
  ): Promise<void> {
    const group = await this.classGroupsService.findActiveGroup(toGroupId);

    const existingIds = await this.getActiveStudentIdsByGroup(group.id);
    const newIds = this.filterNewStudents(studentIds, existingIds);

    this.assertHasNewStudents(
      newIds,
      'Todos los alumnos ya están en el grupo destino',
    );
    this.assertCapacity(group.max_students, existingIds.size, newIds.length);

    await this.enrollmentRepo.manager.transaction(async (manager) => {
      const updated = await manager.update(
        Enrollment,
        {
          classGroup: { id: fromGroupId },
          student: { auth_id: In(newIds) },
          status: EnrollmentStatus.ACTIVE,
        },
        {
          status: EnrollmentStatus.MOVED,
          unenrolled_at: new Date(),
        },
      );

      if (updated.affected !== newIds.length) {
        throw new BadRequestException(
          'Uno o más estudiantes no pertenecen al grupo origen o ya fueron movidos',
        );
      }

      const newEnrollments = newIds.map((studentId) =>
        manager.create(Enrollment, {
          classGroup: { id: toGroupId },
          student: { auth_id: studentId },
          status: EnrollmentStatus.ACTIVE,
        }),
      );

      await manager.save(newEnrollments);
    });
  }

  async findEnrollmentActive(class_group_id: string) {
    const enrollments = await this.enrollmentRepo.find({
      where: {
        classGroup: { id: class_group_id },
        status: EnrollmentStatus.ACTIVE,
      },
      relations: ['student'],
    });

    return enrollments.map((e) => e.student.auth_id);
  }

  async getStudentsWithAttendance(
    groupId: string,
  ): Promise<EnrollmentResponseDto[]> {
    const qb = this.enrollmentRepo
      .createQueryBuilder('e')
      .innerJoin('e.student', 's')
      .innerJoin('s.user', 'u')

      .leftJoin(
        'CLASS_SESSIONS',
        'cs',
        'cs.class_group_id = e.class_group_id AND cs.attendance_closed_at IS NOT NULL',
      )
      .leftJoin(
        'ATTENDANCES',
        'a',
        'a.student_id = s.auth_id AND a.class_session_id = cs.id',
      )

      .where('e.class_group_id = :groupId', { groupId })
      .andWhere('e.status = :status', { status: EnrollmentStatus.ACTIVE })
      .andWhere('s.is_active = true')
      .andWhere('u.is_active = true')

      .select([
        's.auth_id AS id',
        `
      TRIM(
        CONCAT(
          u.first_name, ' ',
          COALESCE(u.middle_name, ''), ' ',
          u.last_name, ' ',
          COALESCE(u.second_last_name, '')
        )
      ) AS full_name
      `,

        'e.status AS enrollment_status',

        'e.enrolled_at AS enrolled_at',

        `
      COALESCE(
        ROUND(
          (
            COUNT(*) FILTER (WHERE a.status = 'PRESENT')::decimal
            / NULLIF(COUNT(DISTINCT cs.id), 0)
          ) * 100
        , 2)
      , 0) AS attendance_percentage
      `,
      ])

      .groupBy('s.auth_id')
      .addGroupBy('u.first_name')
      .addGroupBy('u.middle_name')
      .addGroupBy('u.last_name')
      .addGroupBy('u.second_last_name')
      .addGroupBy('e.status')
      .addGroupBy('e.enrolled_at')
      .orderBy('attendance_percentage', 'ASC');

    const result = await qb.getRawMany<{
      id: string;
      full_name: string;
      enrollment_status: EnrollmentStatus;
      enrolled_at: Date;
      attendance_percentage: string;
    }>();

    return result.map((r) => ({
      id: r.id,
      full_name: r.full_name,
      enrollment_status: r.enrollment_status,
      enrolled_at: r.enrolled_at,
      attendance_percentage: Number(r.attendance_percentage),
    }));
  }

  async removeSeed(manager: EntityManager): Promise<void> {
    await manager.getRepository(Enrollment).clear();
  }
}
