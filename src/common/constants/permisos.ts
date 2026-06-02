export const PERMISSIONS = {
  // Users
  VER_USUARIOS: 'ver_usuarios',
  CREAR_USUARIO: 'crear:usuario',
  EDITAR_USUARIO: 'editar_usuario',
  ACTIVAR_USUARIO: 'activar_usuario',
  DESACTIVAR_USUARIO: 'desactivar_usuario',
  IMPORTAR_USUARIOS: 'importar:usuarios',
  RECUPERAR_PASSWORD: 'recuperar_password',
  DESCARGAR_PLANTILLA_USUARIOS: 'descargar_plantilla_usuarios',

  // Subjects
  VER_ASIGNATURAS: 'ver_asignaturas',
  CREAR_ASIGNATURA: 'crear_asignatura',
  EDITAR_ASIGNATURA: 'editar_asignatura',
  ELIMINAR_ASIGNATURA: 'eliminar_asignatura',
  IMPORTAR_ASIGNATURAS: 'importar_asignaturas',
  DESCARGAR_PLANTILLA_ASIGNATURAS: 'descargar_plantilla_asignaturas',

  // Semesters
  PLANEACION: 'planeacion',
  VER_SEMESTRES: 'ver_semestres',
  CREAR_SEMESTRE: 'crear_semestre',
  EDITAR_SEMESTRE: 'editar_semestre',
  CAMBIAR_ESTADO_SEMESTRE: 'cambiar_estado_semestre',
  ELIMINAR_SEMESTRE: 'eliminar_semestre',

  // Class groups
  VER_GRUPOS: 'ver_grupos',
  CREAR_GRUPO: 'crear_grupo',
  EDITAR_GRUPO: 'editar_grupo',
  ELIMINAR_GRUPO: 'eliminar_grupo',
  GESTIONAR_HORARIOS: 'gestionar_horarios',
  VER_ESTUDIANTES_GRUPO: 'ver_estudiantes_grupo',
  MATRICULAR_ESTUDIANTES: 'matricular_estudiantes',
  RETIRAR_ESTUDIANTES: 'retirar_estudiantes',
  TRANSFERIR_ESTUDIANTES: 'transferir_estudiantes',
  DESCARGAR_PLANTILLA_GRUPO: 'descargar_plantilla_grupo',

  // Roles & permissions
  MANAGE_ROLE: 'manage:role',

  // Reports
  VER_REPORTES: 'ver:reportes',
  EXPORTAR_REPORTES: 'exportar_reportes',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
