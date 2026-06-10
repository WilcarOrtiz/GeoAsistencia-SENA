import {
  BadRequestException,
  Inject,
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
import type { ICacheService } from 'src/common/cache/cache.interface';
import {
  CACHE_SERVICE,
  CacheModules,
  CacheTTLTimes,
} from 'src/common/cache/cache.constants';
import { CacheKeyFactory } from 'src/common/cache/cache-key.factory';
import { DashboardService } from '../../dashboard/dashboard.service';
import { ClassGroup } from '../class-groups/entities/class-group.entity';
import { Teacher } from 'src/users/teacher/entities/teacher.entity';
import { AttendanceGateway } from './attendance.gateway';

@Injectable()
export class ClassSessionsService {
  constructor(
    @InjectRepository(ClassSessions)
    private readonly classSessionRepo: Repository<ClassSessions>,
    private classDaysService: ClassDaysService,
    private classGroupsService: ClassGroupsService,
    private enrollmentService: EnrollmentService,
    private attendancesService: AttendancesService,
    private readonly dashboardService: DashboardService,
    private readonly attendanceGateway: AttendanceGateway,

    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  private key(action: string, params?: Record<string, unknown>): string {
    return CacheKeyFactory.build(CacheModules.CLASS_SESSIONS, action, params);
  }

  private async invalidateSessionsOfGroup(): Promise<void> {
    await this.cache.delByPrefix(
      `${CacheModules.CLASS_SESSIONS}:sessions-by-group`,
    );
  }

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

    // ✅ Validar horario y obtener la hora actual
    const attendance_opened_at =
      await this.classDaysService.validateDayClassInSession(grupo.id);

    // ✅ NUEVA VALIDACIÓN: evitar duplicidad de sesión para el mismo día y franja horaria
    await this.checkNoDuplicateSessionToday(grupo.id, attendance_opened_at);

    const code_class_session = uuidv4();

    const newSession = this.classSessionRepo.create({
      class_topic,
      classGroup: { id: grupo.id } as ClassGroup,
      teacher: { auth_id: grupo.teacher.auth_id } as Teacher,
      teacher_latitude: latitude,
      teacher_longitude: longitude,
      attendance_opened_at,
      code_class_session,
    });

    const classSession = await this.classSessionRepo.save(newSession);

    const studentsActive = await this.enrollmentService.findEnrollmentActive(
      grupo.id,
    );

    if (studentsActive.length > 0) {
      await this.attendancesService.createBulkForSession(
        classSession.id,
        studentsActive,
      );
    }

    await Promise.all([
      this.invalidateSessionsOfGroup(),
      this.classGroupsService.invalidateGroup(group_id),
    ]);

    return classSession;
  }

  /**
   * Verifica que no exista ya una sesión abierta o cerrada para el mismo grupo,
   * el mismo día calendario y la misma franja horaria (attendance_opened_at).
   *
   * Se compara la fecha (DATE de created_at) y la hora de apertura como string
   * para cubrir el caso de que un docente intente abrir dos sesiones en el mismo
   * bloque de clase del mismo día.
   */
  private async checkNoDuplicateSessionToday(
    groupId: string,
    openedAtTime: string,
  ): Promise<void> {
    const nowColombia = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }),
    );
    const todayDate = nowColombia.toISOString().split('T')[0];

    const existing = await this.classSessionRepo
      .createQueryBuilder('cs')
      .where('cs.class_group_id = :groupId', { groupId })
      .andWhere("DATE(cs.created_at AT TIME ZONE 'America/Bogota') = :today", {
        today: todayDate,
      })
      .andWhere('cs.attendance_opened_at = :openedAt', {
        openedAt: openedAtTime,
      })
      .getOne();

    if (existing) {
      throw new BadRequestException(
        `Ya existe una sesión de asistencia para este grupo hoy en el horario ${openedAtTime}. No se puede crear otra sesión duplicada.`,
      );
    }
  }

  async findActiveSessionByGroup(groupId: string) {
    const session = await this.classSessionRepo
      .createQueryBuilder('cs')
      .where('cs.class_group_id = :groupId', { groupId })
      .andWhere('cs.can_mark_attendance = true')
      .orderBy('cs.created_at', 'DESC')
      .select(['cs.id', 'cs.code_class_session'])
      .getOne();

    if (!session) return null;

    return {
      sessionId: session.id,
      codeClassSession: session.code_class_session,
    };
  }

  async closeSession(id: string): Promise<ClassSessions> {
    const session = await this.classSessionRepo.preload({
      id,
      can_mark_attendance: false,
      attendance_closed_at: new Date().toLocaleTimeString('es-CO', {
        timeZone: 'America/Bogota',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    });

    if (!session) {
      throw new NotFoundException('Sesión no encontrada');
    }

    await Promise.all([
      this.invalidateSessionsOfGroup(),
      this.dashboardService.invalidateDashboard(),
    ]);

    return await this.classSessionRepo.save(session);
  }

  async findSessionsByGroup(groupId: string) {
    const cacheKey = this.key('sessions-by-group', { groupId });
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

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

    const result = sessions.map(
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

    await this.cache.set(cacheKey, result, CacheTTLTimes.SESSIONS);
    return result;
  }

  async findAttendancesBySession(sessionId: string) {
    const cacheKey = this.key('attendances-by-session', { sessionId });
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const session = await this.classSessionRepo.findOne({
      where: { id: sessionId },
      relations: [
        'attendances',
        'attendances.student',
        'attendances.student.user',
      ],
    });

    if (!session) throw new NotFoundException('Sesión no encontrada');

    const result = session.attendances.map((a) => ({
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

    if (!session.can_mark_attendance) {
      await this.cache.set(cacheKey, result, CacheTTLTimes.DETAIL);
    }

    return result;
  }

  /**
   * Llamado desde AttendancesService cuando un alumno marca asistencia.
   * Invalida el caché de la sesión y emite el evento WebSocket al docente.
   */
  async notifyAttendanceMarked(sessionId: string): Promise<void> {
    await this.cache.del(this.key('attendances-by-session', { sessionId }));

    const records = await this.findAttendancesBySession(sessionId);
    this.attendanceGateway.emitAttendanceUpdate(
      sessionId,
      records as unknown[],
    );
  }

  async removeSeed(manager: EntityManager): Promise<void> {
    const repo = manager.getRepository(ClassSessions);
    await repo.createQueryBuilder().delete().execute();
  }
}
