// dashboard.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import type { ICurrentUser } from 'src/common/interface/current-user.interface';
import { GetUser } from 'src/common/decorators';
import { AdminFilterDto } from './dto/admin-filters.dto';
import { TeacherFilterDto } from './dto/teacher-filters.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // ── Overview (cards) ────────────────────────────────────────

  @Get('teacher/overview')
  @ApiOperation({
    summary: 'Overview (cards)',
    description: `
       * Retorna las 4 métricas principales del docente en el semestre activo:
   * - Total de sesiones realizadas en sus grupos
   * - Tasa de asistencia global (% de PRESENT sobre el total)
   * - Total de estudiantes activos matriculados en sus grupos
   * - Grupo crítico: el grupo con menor tasa de asistencia (nombre + %)
   `,
  })
  teacherOverview(@GetUser() user: ICurrentUser) {
    return this.dashboardService.teacherOverview(user.authId);
  }

  @Get('admin/overview')
  @ApiOperation({
    summary: 'Overview (cards)',
    description: `
      /**
       * Retorna las 4 métricas principales globales con filtros opcionales:
       * - Total de sesiones realizadas
       * - Tasa de asistencia global
       * - Total de estudiantes activos matriculados
       * - Grupo crítico: el grupo con menor tasa de asistencia (nombre + %)
       * Sin filtros devuelve métricas de toda la institución.
       */`,
  })
  adminOverview(@Query() filters: AdminFilterDto) {
    return this.dashboardService.adminOverview(filters);
  }

  // ── Asistencia por grupo (barras apiladas) ───────────────────

  @Get('teacher/attendance')
  @ApiOperation({
    summary: 'Asistencia por grupo (barras apiladas)',
    description: `
      * Retorna el % de asistencia e inasistencia por cada grupo del docente 
    * en el semestre activo. Usado para la gráfica de barras apiladas.
   * Ej: Grupo A → 88% presente, 12% ausente
    `,
  })
  teacherAttendance(@GetUser() user: ICurrentUser) {
    return this.dashboardService.teacherAttendance(user.authId);
  }

  @Get('admin/attendance')
  @ApiOperation({
    summary: 'Asistencia por grupo (barras apiladas)',
    description: `
      * Retorna el % de asistencia e inasistencia por cada grupo de todos los docentes.
        * Soporta filtros opcionales por semestre, docente y materia.
        * Sin filtros devuelve todos los semestres. Usado para la gráfica de barras apiladas del admin.
      `,
  })
  adminAttendance(@Query() filters: AdminFilterDto) {
    return this.dashboardService.adminAttendance(filters);
  }

  // ── Distribución PRESENT/ABSENT/LATE (dona) ──────────────────
  @Get('teacher/distribution')
  @ApiOperation({
    summary: 'Asistencia por grupo (barras apiladas)',
    description: `
   * Retorna la distribución de estados de asistencia del docente en el semestre activo:
   * cuántos registros son PRESENT, ABSENT y LATE con su % sobre el total.
   * Usado para la gráfica de dona.
      `,
  })
  teacherDistribution(@GetUser() user: ICurrentUser) {
    return this.dashboardService.teacherDistribution(user.authId);
  }

  @Get('admin/distribution')
  @ApiOperation({
    summary: 'Asistencia por grupo (barras apiladas)',
    description: `
      * Retorna la distribución de estados de asistencia global (PRESENT, ABSENT, LATE)
      * con filtros opcionales por semestre, docente y materia.
      * Usado para la gráfica de dona del admin.
      `,
  })
  adminDistribution(@Query() filters: AdminFilterDto) {
    return this.dashboardService.adminDistribution(filters);
  }

  // ── Ranking materias (barras horizontales, solo admin) ───────

  @Get('admin/subjects-ranking')
  @ApiOperation({
    summary: 'Ranking materias (barras horizontales, solo admin)',
    description: `
     * Retorna las materias ordenadas de mayor a menor % de asistencia promedio
   * entre todos sus grupos, con filtros opcionales. Por defecto top 10.
   * Usado para barras horizontales de materias del admin.
      `,
  })
  adminSubjectsRanking(@Query() filters: AdminFilterDto) {
    return this.dashboardService.adminSubjectsRanking(filters);
  }

  // ── Estudiantes con más ausencias (tabla) ────────────────────
  @Get('teacher/students-absences')
  @Get('admin/subjects-ranking')
  @ApiOperation({
    summary: 'Estudiantes con más ausencias (tabla)',
    description: `
     * Retorna los estudiantes con más ausencias en los grupos del docente
   * durante el semestre activo, ordenados de mayor a menor ausencias.
   * Por defecto top 10. Usado para la tabla de alerta temprana.
      `,
  })
  teacherStudentsAbsences(
    @GetUser() user: ICurrentUser,
    @Query() filters: TeacherFilterDto,
  ) {
    return this.dashboardService.teacherStudentsAbsences(user.authId, filters);
  }

  @Get('admin/students-absences')
  @Get('admin/subjects-ranking')
  @ApiOperation({
    summary: 'Estudiantes con más ausencias (tabla)',
    description: `
   * Retorna los estudiantes con más ausencias globalmente con filtros opcionales
     * por semestre, docente y materia, ordenados de mayor a menor ausencias.
     * Por defecto top 10. Usado para la tabla de alerta temprana del admin.
      `,
  })
  adminStudentsAbsences(@Query() filters: AdminFilterDto) {
    return this.dashboardService.adminStudentsAbsences(filters);
  }
}
