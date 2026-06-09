export const CACHE_SERVICE = 'CACHE_SERVICE';

export const CacheTTLTimes = {
  LIST: 60, // 1 min  — listas paginadas
  DETAIL: 300, // 5 min  — detalle individual
  SEARCH: 45, // 45 s   — búsquedas dinámicas con term
  DASHBOARD: 60, // 1 min  — métricas (RPCs pesadas en Supabase)
  REFERENCE: 600, // 10 min — datos casi estáticos (opciones de transferencia)
  SESSIONS: 30, // 30 s   — sesiones activas (cambian frecuentemente)
  ENROLLMENT: 120, // 2 min  — listado de estudiantes en grupo
} as const;

/** Prefijos por módulo — úsalos para invalidar en bloque */
export const CacheModules = {
  CLASS_GROUPS: 'class-groups',
  CLASS_SESSIONS: 'class-sessions',
  ENROLLMENT: 'enrollment',
  DASHBOARD: 'dashboard',
} as const;
