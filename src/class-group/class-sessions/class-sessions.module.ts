import { Module } from '@nestjs/common';
import { ClassSessionsService } from './class-sessions.service';
import { ClassSessions } from './entities/class-session.entity';
import { ClassSessionsController } from './class-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassDaysModule } from '../class-days/class-days.module';
import { ClassGroupsModule } from '../class-groups/class-groups.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { AttendancesModule } from '../attendances/attendances.module';

@Module({
  controllers: [ClassSessionsController],
  providers: [ClassSessionsService],
  imports: [
    TypeOrmModule.forFeature([ClassSessions]),
    ClassDaysModule,

    ClassGroupsModule,
    EnrollmentModule,
    AttendancesModule,
  ],
  exports: [TypeOrmModule, ClassSessionsService],
})
export class ClassSessionsModule {}

//TODO: ENDPOINT FALTANTES
/*🧠 TODO — SISTEMA ASISTENCIA CLASES
🔴 FASE 1 — ENDPOINTS FALTANTES (BACKEND)
📚 Class Sessions
❌ Listar sesiones de un grupo
GET /class-sessions/group/:groupId
👉 Ver todas las sesiones de un grupo de clase
❌ Ver detalle de una sesión
GET /class-sessions/:id
👉 Información completa de una sesión
❌ Ver asistencia de una sesión
GET /class-sessions/:id/attendance
👉 Lista de estudiantes que asistieron a esa sesión
❌ Cerrar sesión
PATCH /class-sessions/:id/close
👉 Finalizar sesión de asistencia (docente)
📚 Class Groups
❌ Remover estudiante de un grupo
DELETE /class-groups/:groupId/students/:studentId
👉 Eliminar estudiante de un grupo de clase
📊 Attendances
❌ Historial del estudiante
GET /attendances/my-history
👉 El estudiante ve:
sesiones del grupo
si asistió o no
🟠 FASE 2 — SEGURIDAD Y CONSISTENCIA
🔐 Roles (MUY IMPORTANTE)
 Unificar nombres de roles en backend y frontend
 Definir reglas claras:
Rol	Acceso
ADMIN	todo
TEACHER	solo grupos asignados
STUDENT	solo sus enrollments
🛡️ Guards
 Proteger todos los endpoints
 Validar ownership:
teacher → solo sus grupos
student → solo sus matrículas
🚨 Manejo de errores
 No exponer errores técnicos al frontend
 No devolver queries, stacktrace o info interna
 Centralizar respuestas:

Ejemplo:

❌ QueryFailedError
✅ No tienes permisos para esta acción*/
