import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ClassSessionsService } from './class-sessions.service';
import { CreateClassSessionDto } from './dto/create-class-session.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
  CreateSessionResponseDto,
  SessionAttendanceSummaryDto,
} from './dto/class-session.response.dto';
import { toDto } from 'src/common/utils/dto-mapper.util';
import { SessionAttendanceDetailDto } from '../attendances/dto/attendances-detail-by-session.dto';

@Controller('class-sessions')
export class ClassSessionsController {
  constructor(private readonly classSessionsService: ClassSessionsService) {}

  @Get('/group/:id')
  @ApiOperation({
    summary: 'Listar las sesiones de un grupo de clase',
  })
  @ApiOkResponse({ type: SessionAttendanceSummaryDto })
  async findSessionsByGroup(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SessionAttendanceSummaryDto> {
    const result = await this.classSessionsService.findSessionsByGroup(id);
    return toDto(SessionAttendanceSummaryDto, result);
  }

  @Get(':id/attendances')
  @ApiOperation({
    summary: 'Listar las asistencias de una sesion',
  })
  async findAttendanceBySession(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SessionAttendanceDetailDto> {
    const result = await this.classSessionsService.findAttendancesBySession(id);
    return toDto(SessionAttendanceDetailDto, result);
  }

  @Get('/group/:id/active')
  @ApiOperation({
    summary: 'Obtener sesión activa de un grupo',
  })
  async findActiveSession(@Param('id', ParseUUIDPipe) id: string) {
    const session =
      await this.classSessionsService.findActiveSessionByGroup(id);

    return session;
  }

  @Post()
  @ApiOperation({
    summary: 'Iniciar llamado a lista',
    description:
      'Crear un registro de Sesion de clase, para iniciar un llamado lista, todos los alumnos tendran el estado AUSENTE',
  })
  @ApiOkResponse({ type: CreateSessionResponseDto })
  async openSession(@Body() dto: CreateClassSessionDto) {
    console.log('🔥 RAW BODY:', dto);
    const session = await this.classSessionsService.createSession(dto);
    return toDto(CreateSessionResponseDto, session);
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
