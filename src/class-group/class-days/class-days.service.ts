import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClassDayDto } from './dto/create-class-day.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassDays } from './entities/class-day.entity';
import { EntityManager, Repository } from 'typeorm';
import { ClassGroupsService } from '../class-groups/class-groups.service';
import { getWeekDayLabel, WeekDay } from 'src/common/enums/weeyDay.enum';

@Injectable()
export class ClassDaysService {
  constructor(
    @InjectRepository(ClassDays)
    private readonly classDaysRepo: Repository<ClassDays>,
    private readonly classGroupsService: ClassGroupsService,
  ) {}

  async create(createClassDayDto: CreateClassDayDto): Promise<ClassDays> {
    const { start_time, end_time, classGroup_id, day } = createClassDayDto;

    const classGroup =
      await this.classGroupsService.findActiveGroup(classGroup_id);

    if (start_time >= end_time) {
      throw new BadRequestException(
        'La hora de inicio debe ser menor que la hora de fin',
      );
    }

    const existing = await this.classDaysRepo.findOne({
      where: {
        classGroup: { id: classGroup_id },
        day,
        start_time,
        end_time,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `El grupo ya tiene un horario el ${getWeekDayLabel(day)}  de ${start_time} a ${end_time}`,
      );
    }

    const classDay = this.classDaysRepo.create({
      start_time,
      end_time,
      classGroup,
      day,
    });

    return await this.classDaysRepo.save(classDay);
  }

  async validateDayClassInSession(groupId: string) {
    const now = new Date();
    const dayOfWeek = now.getDay() as WeekDay;

    const currentTime = now.toTimeString().split(' ')[0];

    const schedule = await this.classDaysRepo.findOne({
      where: {
        classGroup: { id: groupId },
        is_active: true,
        day: dayOfWeek,
      },
    });

    if (!schedule) {
      throw new BadRequestException(
        `No hay clase este día ${getWeekDayLabel(dayOfWeek)}`,
      );
    }

    const isInSchedule =
      currentTime >= schedule.start_time && currentTime <= schedule.end_time;

    if (!isInSchedule) {
      throw new BadRequestException(
        `Estas fuera del horario de clase ${schedule.start_time} a ${schedule.end_time}`,
      );
    }

    return currentTime;
  }

  async removeSeed(manager: EntityManager): Promise<void> {
    const repo = manager.getRepository(ClassDays);
    await repo.createQueryBuilder().delete().execute();
  }
}

/*✅ Actualizar directamente (UPDATE) cuando:

Solo cambia la hora (start_time / end_time) del mismo día de la semana
Es una corrección de datos (error al ingresar)
El grupo aún no ha tenido sesiones de clase relacionadas

Esto es seguro porque CLASS_DAYS define el horario del grupo, no es un registro histórico por sí mismo.

✅ Soft delete (is_active = false) + nuevo registro cuando:

Cambia el día de la semana (e.g. de lunes a miércoles)
El grupo ya tiene CLASS_SESSIONS asociadas a ese horario
Quieres mantener trazabilidad de cómo evolucionó el horario*/
