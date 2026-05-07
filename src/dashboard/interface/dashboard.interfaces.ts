export interface TeacherGroupAttendance {
  group_id: string;
  group_name: string;
  subject_name: string;
  porcentaje_asistencia: number;
  porcentaje_inasistencia: number;
}

export interface AdminGroupAttendance {
  group_id: string;
  group_name: string;
  teacher_id: string;
  teacher_name: string;
  semester_name: string;
  subject_name: string;
  porcentaje_asistencia: number;
  porcentaje_inasistencia: number;
}

export interface DashboardOverview {
  total_sesiones: number;
  tasa_asistencia: number;
  total_estudiantes: number;
  grupo_critico_nombre: string | null;
  grupo_critico_tasa: number | null;
}
