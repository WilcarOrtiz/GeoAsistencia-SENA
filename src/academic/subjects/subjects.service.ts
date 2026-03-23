import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
  ) {}

  /** Lanza NotFoundException si el subject no existe */
  private async findByIdOrFail(id: string): Promise<Subject> {
    const subject = await this.subjectRepo.findOneBy({ id });
    if (!subject) throw new NotFoundException('Asignatura no encontrada');
    return subject;
  }

  /** Lanza BadRequestException si name o code ya están en uso (excluye excludeId) */
  private async assertNoDuplicate(
    name: string,
    code: string,
    excludeId?: string,
  ): Promise<void> {
    const qb = this.subjectRepo
      .createQueryBuilder('s')
      .where('(s.name = :name OR s.code = :code) AND s.is_active = true', {
        name,
        code,
      });

    if (excludeId) qb.andWhere('s.id != :excludeId', { excludeId });

    const conflict = await qb.getOne();
    if (!conflict) return;

    if (conflict.code.toUpperCase() === code.toUpperCase())
      throw new BadRequestException(`El código '${code}' ya está en uso`);

    throw new BadRequestException(
      `Ya existe una asignatura con el nombre '${name}'`,
    );
  }

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const { name, code } = createSubjectDto;
    await this.assertNoDuplicate(name, code);
    const subject = this.subjectRepo.create(createSubjectDto);
    return this.subjectRepo.save(subject);
  }

  async update(
    id: string,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    const subject = await this.findByIdOrFail(id);

    if (updateSubjectDto.name || updateSubjectDto.code) {
      const name = updateSubjectDto.name ?? subject.name;
      const code = updateSubjectDto.code ?? subject.code;
      await this.assertNoDuplicate(name, code, id);
    }

    this.subjectRepo.merge(subject, updateSubjectDto);
    return this.subjectRepo.save(subject);
  }

  async findOne(term: string): Promise<Subject> {
    const subject = isUUID(term)
      ? await this.subjectRepo.findOneBy({ id: term, is_active: true })
      : await this.subjectRepo
          .createQueryBuilder('s')
          .where('(s.code = :term OR s.name = :term) AND s.is_active = true', {
            term,
          })
          .getOne();

    if (!subject)
      throw new NotFoundException(`Asignatura "${term}" no encontrada`);
    return subject;
  }

  async remove(id: string): Promise<{ message: string }> {
    const subject = await this.findByIdOrFail(id);
    subject.is_active = false;
    await this.subjectRepo.save(subject);
    return { message: 'Asignatura desactivada correctamente' };
  }
}
