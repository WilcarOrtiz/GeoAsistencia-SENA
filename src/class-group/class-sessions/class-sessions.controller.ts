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

//TODO:

/*❌ GET /class-sessions/:groupId        → listar sesiones de un grupo
❌ GET /class-sessions/:id/attendance  → ver lista de asistencia de una sesión  
❌ GET /attendances/my                 → el estudiante ve sus propias asistencias
❌ PATCH /class-sessions/:id/close     → cerrar sesión (el controller existe?)
FALTA TAMBIEN EL DE REMOVE ESTUDIANTE DE UN GRUPO DE CLASE
*/

/* 
mejor dicho me falta el endpoint para ver las sesiones de un grupo de clase
me falta las asistencias a una sesion de clase

me falta el endpoit que permite a un estudiante ver sus asistencias a a un grupo de clase ( es decir las sesiones realizadas en el grupo de clase y si asistio )

me falta organizar bien los permisos ( es decir que los nombres concuerden en backen y frontned)
me falta poner los guard en los endpoint
me falta mejorar las respuesta a los errores ( os sea no mandar informaicon sensible al fronted desde el backend)


Ah perfecto, entonces el rol de cada plataforma queda clarísimo:
Web (admin/docente) → solo visualización y gestión

Ver reportes de asistencia
Ver historial de sesiones
Gestión de grupos, usuarios, semestres, etc.

Móvil (docente y estudiante) → toda la acción en tiempo real

Docente: abre sesión → genera el código/QR → cierra sesión
Estudiante: ingresa código → GPS valida → marca asistencia


Con eso el orden cambia un poco:
FASE 1 — Endpoints faltantes del backend
Los mismos de antes, pero ahora sabiendo quién consume qué:
GET /class-sessions/group/:groupId        → web (ver historial) + móvil (docente ve sus sesiones)
GET /class-sessions/:id                   → web (detalle sesión) + móvil (docente ve quién marcó)
GET /attendances/my-history               → móvil estudiante
FASE 2 — Flutter
Porque la web de visualización la puedes hacer en cualquier momento, pero la app es el corazón del sistema — sin ella no hay asistencias, y sin asistencias no hay nada que mostrar en la web.
FASE 3 — Web: vistas de visualización
Con datos reales ya generados desde la app, construyes los reportes y el historial sobre datos verdaderos, no inventados.*/
