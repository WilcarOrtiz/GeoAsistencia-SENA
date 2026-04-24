import { IMenuSystemCreate } from 'src/access-control-module/menu/interface/menu-system.interface';
import { IPermissionSystemCreate } from 'src/access-control-module/permissions/interface/permission-system.interface';
import { IRoleSystemCreate } from 'src/access-control-module/roles/interface/role-system.interface';
import { ValidRole } from 'src/common/enums/valid-role.enum';

type IMenuSeed = IMenuSystemCreate & { parent_name?: string };

interface SeedData {
  permissions: IPermissionSystemCreate[];
  roles: IRoleSystemCreate[];
  menus: IMenuSeed[]; // Cambiado a plural y arreglo
}
export const initialData: SeedData = {
  permissions: [
    // =========================
    // 👥 USERS
    // =========================
    { name: 'ver_usuarios', description: 'Ver lista de usuarios' },
    { name: 'crear_usuario', description: 'Crear usuarios' },
    { name: 'editar_usuario', description: 'Editar usuarios' },
    { name: 'activar_usuario', description: 'Activar usuarios' },
    { name: 'desactivar_usuario', description: 'Desactivar usuarios' },
    { name: 'importar_usuarios', description: 'Importar usuarios desde Excel' },
    {
      name: 'recuperar_password',
      description: 'Enviar recuperación de contraseña',
    },
    {
      name: 'descargar_plantilla_usuarios',
      description: 'Descargar plantilla de usuarios',
    },

    // =========================
    // 📚 SUBJECTS
    // =========================
    { name: 'ver_asignaturas', description: 'Ver asignaturas' },
    { name: 'crear_asignatura', description: 'Crear asignatura' },
    { name: 'editar_asignatura', description: 'Editar asignatura' },
    { name: 'eliminar_asignatura', description: 'Eliminar asignatura' },
    { name: 'importar_asignaturas', description: 'Importar asignaturas Excel' },
    {
      name: 'descargar_plantilla_asignaturas',
      description: 'Descargar plantilla asignaturas',
    },

    // =========================
    // 📅 SEMESTERS
    // =========================
    {
      name: 'planeacion',
      description: 'Acceso al panel de planeacion academica',
    },
    { name: 'ver_semestres', description: 'Ver semestres' },
    { name: 'crear_semestre', description: 'Crear semestre' },
    { name: 'editar_semestre', description: 'Editar semestre' },
    {
      name: 'cambiar_estado_semestre',
      description: 'Activar/Desactivar semestre',
    },
    { name: 'eliminar_semestre', description: 'Eliminar semestre' },

    // =========================
    // 🎓 CLASS GROUPS
    // =========================
    { name: 'ver_grupos', description: 'Ver grupos de clase' },
    { name: 'crear_grupo', description: 'Crear grupo de clase' },
    { name: 'editar_grupo', description: 'Editar información de grupo' },
    { name: 'eliminar_grupo', description: 'Eliminar grupo' },

    { name: 'gestionar_horarios', description: 'Editar horarios del grupo' },

    { name: 'ver_estudiantes_grupo', description: 'Ver estudiantes del grupo' },
    { name: 'matricular_estudiantes', description: 'Matricular estudiantes' },
    { name: 'retirar_estudiantes', description: 'Retirar estudiantes' },
    {
      name: 'transferir_estudiantes',
      description: 'Transferir estudiantes entre grupos',
    },

    {
      name: 'descargar_plantilla_grupo',
      description: 'Descargar plantilla de matrícula',
    },

    // =========================
    // 🔐 ROLES & PERMISSIONS
    // =========================
    { name: 'manage:role', description: 'Asignar permisos a roles' },

    // =========================
    // 📊 REPORTS
    // =========================
    { name: 'ver_reportes', description: 'Ver métricas y reportes' },
    { name: 'exportar_reportes', description: 'Exportar datos (PDF/Excel)' },
  ],

  roles: [
    {
      name: ValidRole.ADMIN,
      description: 'Administrador con acceso total',
      permissions: [
        'planeacion',
        'ver_usuarios',
        'crear_usuario',
        'editar_usuario',
        'activar_usuario',
        'desactivar_usuario',
        'importar_usuarios',
        'recuperar_password',
        'descargar_plantilla_usuarios',

        'ver_asignaturas',
        'crear_asignatura',
        'editar_asignatura',
        'eliminar_asignatura',
        'importar_asignaturas',
        'descargar_plantilla_asignaturas',

        'ver_semestres',
        'crear_semestre',
        'editar_semestre',
        'cambiar_estado_semestre',
        'eliminar_semestre',

        'ver_grupos',
        'crear_grupo',
        'editar_grupo',
        'eliminar_grupo',
        'gestionar_horarios',
        'ver_estudiantes_grupo',
        'matricular_estudiantes',
        'retirar_estudiantes',
        'transferir_estudiantes',
        'descargar_plantilla_grupo',

        'manage:role',

        'ver_reportes',
        'exportar_reportes',
      ],
    },

    {
      name: ValidRole.TEACHER,
      description: 'Docente',
      permissions: [
        'ver_asignaturas',
        'ver_semestres',

        'ver_grupos',
        'ver_estudiantes_grupo',

        'matricular_estudiantes',
        'retirar_estudiantes',
        'transferir_estudiantes',

        'gestionar_horarios',

        'ver_reportes',
      ],
    },

    {
      name: ValidRole.STUDENT,
      description: 'Estudiante',
      permissions: ['ver_asignaturas', 'ver_grupos', 'ver_estudiantes_grupo'],
    },
  ],

  menus: [
    // =========================
    // DASHBOARD
    // =========================
    {
      name: 'Dashboard',
      route: '/dashboard',
      icon: 'LayoutDashboard',
      permission_name: 'ver_reportes',
      order_index: 1,
    },
    // =========================
    // ROLES
    // =========================
    {
      name: 'Roles y permisos',
      route: '/roles',
      icon: 'ShieldUser',
      permission_name: 'manage:role',
      order_index: 2,
    },
    // =========================
    // USERS
    // =========================
    {
      name: 'Gestion de usuario',
      route: '/users',
      icon: 'UserCog',
      permission_name: 'ver_usuarios',
      order_index: 3,
    },
    // =========================
    // CLASS GROUP
    // =========================
    {
      name: 'Gestion de grupo',
      route: '/academic-groups',
      icon: 'LayoutGrid',
      permission_name: 'ver_grupos',
      order_index: 4,
    },
    // =========================
    // ACADEMIC
    // =========================
    {
      name: 'Planeación académica',
      route: 'CalendarClock',
      icon: 'BarChart3',
      permission_name: 'planeacion',
      order_index: 5,
    },
    {
      name: 'Semestres',
      route: '/planning-academic/semester',
      parent_name: 'Planeación académica',
      permission_name: 'ver_semestres',
      order_index: 1,
    },
    {
      name: 'Asignaturas',
      route: '/planning-academic/subject',
      parent_name: 'Planeación académica',
      permission_name: 'ver_asignaturas',
      order_index: 2,
    },
  ],
};
