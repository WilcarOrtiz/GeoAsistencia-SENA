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
import { EnrollmentService } from '../enrollment/enrollment.service';
import { AttendancesService } from '../attendances/attendances.service';

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
  async createSession(createClassSessionDto: CreateClassSessionDto) {
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
  async closeSession(id: string) {
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

  async removeSeed(manager: EntityManager): Promise<void> {
    const repo = manager.getRepository(ClassSessions);
    await repo.createQueryBuilder().delete().execute();
  }
}

/*el crear sesion ahora tiene al docente*/
