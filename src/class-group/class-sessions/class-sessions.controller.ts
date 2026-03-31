import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ClassSessionsService } from './class-sessions.service';
import { CreateClassSessionDto } from './dto/create-class-session.dto';
import { ApiOperation } from '@nestjs/swagger';
import { PublicAccess } from 'src/common/decorators';

@PublicAccess()
@Controller('class-sessions')
export class ClassSessionsController {
  constructor(private readonly classSessionsService: ClassSessionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Iniciar llamado a lista',
    description:
      'Crear un registro de Sesion de clase, para iniciar un llamado lista, todos los alumnos tendran el estado AUSENTE',
  })
  async openSession(@Body() dto: CreateClassSessionDto) {
    const session = await this.classSessionsService.createSession(dto);
    return session;
  }

  @Patch(':id/close')
  @ApiOperation({
    summary: 'Detener llamado a lista',
    description: `
  Detiene el proceso de llamado a lista
  **Lo que incluye:**
  * **1) :** alumnos no tendran permitida registrar su asistencia a dicha sesion de clase.
  * **2) :** el registro de la sesion es actualizado con la hora de finalizacion del llamado a lista.
  `,
  })
  async create(@Param('id', ParseUUIDPipe) id: string) {
    const session = await this.classSessionsService.closeSession(id);
    return session;
  }
}
