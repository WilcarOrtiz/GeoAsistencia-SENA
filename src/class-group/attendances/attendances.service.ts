import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { AttendanceStatus } from 'src/common/enums/attendance-status.enum';
import { ClassSessions } from '../class-sessions/entities/class-session.entity';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,

    @InjectRepository(ClassSessions)
    private readonly classSessionRepo: Repository<ClassSessions>,
  ) {}

  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371000;
    const toRad = (val: number) => (val * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async markAttendance(dto: MarkAttendanceDto) {
    const { code_class_session, latitude, longitude, student_id } = dto;

    const session = await this.classSessionRepo.findOne({
      where: {
        code_class_session,
        can_mark_attendance: true,
      },
    });
    if (!session) throw new NotFoundException('Sesión no encontrada o cerrada');

    if (!session.teacher_latitude || !session.teacher_longitude) {
      throw new BadRequestException('Ubicación del docente no disponible');
    }

    const distance = this.calculateDistance(
      Number(session.teacher_latitude),
      Number(session.teacher_longitude),
      latitude,
      longitude,
    );

    const RADIUS_METERS = process.env.ATTENDANCE_RADIUS_METERS;

    if (!RADIUS_METERS) {
      throw new Error('Radio de distancia tolerable no se encuentra en ENV');
    }

    const radius = parseInt(RADIUS_METERS) || 30;

    if (distance > radius) {
      throw new BadRequestException(
        `Estás a ${Math.round(distance)}m del docente, debes estar a menos de ${radius}m`,
      );
    }

    const attendance = await this.attendanceRepo.findOne({
      where: {
        student: { auth_id: student_id },
        classSession: { id: session.id },
      },
    });

    if (!attendance)
      throw new NotFoundException('Registro de asistencia no encontrado');

    if (attendance.status === AttendanceStatus.PRESENT) {
      throw new BadRequestException('Ya marcaste tu asistencia');
    }

    await this.attendanceRepo.update(attendance.id, {
      status: AttendanceStatus.PRESENT,
      check_in_time: new Date().toTimeString().split(' ')[0],
    });

    return { message: 'Asistencia marcada correctamente' };
  }

  async createBulkForSession(id: string, studentsActive: string[]) {
    await this.attendanceRepo.insert(
      studentsActive.map((auth_id) => ({
        classSession: { id },
        student: { auth_id },
      })),
    );
  }

  async findMyAttendancesInGroup(groupId: string, studentId: string) {
    const attendances = await this.attendanceRepo.find({
      where: {
        student: { auth_id: studentId },
        classSession: { classGroup: { id: groupId } },
      },
      relations: ['classSession'],
      order: { classSession: { created_at: 'DESC' } },
    });

    const total = attendances.length;
    const present = attendances.filter(
      (a) => a.status === AttendanceStatus.PRESENT,
    ).length;

    return {
      group_id: groupId,
      total_sessions: total,
      total_present: present,
      attendance_rate: total > 0 ? Math.round((present / total) * 100) : 0,
      sessions: attendances.map((a) => ({
        session_id: a.classSession.id,
        class_topic: a.classSession.class_topic,
        date: a.classSession.created_at,
        status: a.status,
        check_in_time: a.check_in_time ?? null,
      })),
    };
  }

  async removeSeed(manager: EntityManager): Promise<void> {
    const repo = manager.getRepository(Attendance);
    await repo.createQueryBuilder().delete().execute();
  }
}
