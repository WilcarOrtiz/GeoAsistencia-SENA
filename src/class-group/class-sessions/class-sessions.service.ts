import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ClassSessions } from './entities/class-session.entity';
import { ClassDaysService } from '../class-days/class-days.service';
import { v4 as uuidv4 } from 'uuid';
import { ClassGroupsService } from '../class-groups/class-groups.service';
import { CreateClassSessionDto } from './dto/create-class-session.dto';
import { EnrollmentService } from '../enrollment/service/enrollment.service';
import { AttendancesService } from '../attendances/attendances.service';
import { AttendanceStatus } from 'src/common/enums/attendance-status.enum';

@Injectable()
export class ClassSessionsService {
  constructor(
    @InjectRepository(ClassSessions)
    private readonly classSessionRepo: Repository<ClassSessions>,
    private classDaysService: ClassDaysService,
    private classGroupsService: ClassGroupsService,
    private enrollmentService: EnrollmentService,
    private attendancesService: AttendancesService,
  ) {}

  async createSession(
    createClassSessionDto: CreateClassSessionDto,
  ): Promise<ClassSessions> {
    const { group_id, class_topic, latitude, longitude } =
      createClassSessionDto;

    const grupo = await this.classGroupsService.findActiveGroup(group_id);

    if (!grupo.teacher) {
      throw new BadRequestException(
        'El grupo no tiene un docente asignado para crear una sesión',
      );
    }

    const attendance_opened_at =
      await this.classDaysService.validateDayClassInSession(grupo.id);

    const code_class_session = uuidv4();

    const classSession = await this.classSessionRepo.save({
      class_topic,
      classGroup: { id: grupo.id },
      teacher: { auth_id: grupo.teacher.auth_id },
      teacher_latitude: latitude,
      teacher_longitude: longitude,
      attendance_opened_at,
      code_class_session,
    });

    const studentsActive = await this.enrollmentService.findEnrollmentActive(
      grupo.id,
    );

    if (studentsActive.length > 0) {
      await this.attendancesService.createBulkForSession(
        classSession.id,
        studentsActive,
      );
    }

    return classSession;
  }

  async closeSession(id: string): Promise<ClassSessions> {
    const session = await this.classSessionRepo.preload({
      id,
      can_mark_attendance: false,
      attendance_closed_at: new Date().toTimeString().split(' ')[0],
    });

    if (!session) {
      throw new NotFoundException('Sesión no encontrada');
    }
    return await this.classSessionRepo.save(session);
  }

  async findSessionsByGroup(groupId: string) {
    const sessions = await this.classSessionRepo
      .createQueryBuilder('session')
      .where('session.classGroup = :groupId', { groupId })
      .loadRelationCountAndMap('session.total_students', 'session.attendances')
      .loadRelationCountAndMap(
        'session.total_present',
        'session.attendances',
        'present',
        (qb) =>
          qb.where('present.status = :status', {
            status: AttendanceStatus.PRESENT,
          }),
      )
      .orderBy('session.created_at', 'DESC')
      .getMany();

    return sessions.map(
      (s: {
        id: string;
        class_topic: string;
        created_at: Date;
        can_mark_attendance: boolean;
        attendance_opened_at: string;
        attendance_closed_at: string | null;
        total_students?: number;
        total_present?: number;
      }) => ({
        id: s.id,
        class_topic: s.class_topic,
        date: s.created_at,
        is_open: s.can_mark_attendance,
        attendance_opened_at: s.attendance_opened_at,
        attendance_closed_at: s.attendance_closed_at,
        total_students: s.total_students ?? 0,
        total_present: s.total_present ?? 0,
      }),
    );
  }

  async findAttendancesBySession(sessionId: string) {
    const session = await this.classSessionRepo.findOne({
      where: { id: sessionId },
      relations: [
        'attendances',
        'attendances.student',
        'attendances.student.user',
      ],
    });

    if (!session) throw new NotFoundException('Sesión no encontrada');

    return session.attendances.map((a) => ({
      id: a.id,
      status: a.status,
      check_in_time: a.check_in_time ?? null,
      student: {
        id: a.student.auth_id,
        name: [
          a.student.user?.first_name,
          a.student.user?.middle_name,
          a.student.user?.last_name,
          a.student.user?.second_last_name,
        ]
          .filter(Boolean)
          .join(' '),
      },
    }));
  }

  async removeSeed(manager: EntityManager): Promise<void> {
    const repo = manager.getRepository(ClassSessions);
    await repo.createQueryBuilder().delete().execute();
  }
}
