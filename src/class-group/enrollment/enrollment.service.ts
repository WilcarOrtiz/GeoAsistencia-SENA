import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { ClassGroupsService } from '../class-groups/class-groups.service';
import { EnrollmentStatus } from 'src/common/enums/enrollment-status.enum';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
    private readonly classGroupsService: ClassGroupsService,
  ) {}

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

  async removeSeed(manager: EntityManager): Promise<void> {
    await manager.getRepository(Enrollment).clear();
  }
}
