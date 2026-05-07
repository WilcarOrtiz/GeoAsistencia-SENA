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

// ── Distribución dona ─────────────────────────────────────────
export interface AttendanceDistribution {
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  total: number;
  porcentaje: number;
}

// ── Ranking materias (solo admin) ─────────────────────────────
export interface SubjectRanking {
  subject_id: string;
  subject_name: string;
  total_grupos: number;
  porcentaje_asistencia: number;
}

// ── Estudiantes con más ausencias ─────────────────────────────
export interface TeacherStudentAbsence {
  student_id: string;
  student_name: string;
  group_name: string;
  total_clases: number;
  total_ausencias: number;
  porcentaje_ausencia: number;
}

export interface AdminStudentAbsence {
  student_id: string;
  student_name: string;
  group_name: string;
  subject_name: string; // solo admin
  total_clases: number;
  total_ausencias: number;
  porcentaje_ausencia: number;
}
