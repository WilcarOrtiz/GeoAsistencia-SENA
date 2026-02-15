import { IMenuSystemCreate } from 'src/access-control-module/menu/interface/menu-system.interface';
import { IPermissionSystemCreate } from 'src/access-control-module/permissions/interface/permission-system.interface';
import { IRoleSystemCreate } from 'src/access-control-module/roles/interface/role-system.interface';
import { ValidRole } from 'src/common/constants/valid-role.enum';

type IMenuSeed = IMenuSystemCreate & { parent_name?: string };

interface SeedData {
  permissions: IPermissionSystemCreate[];
  roles: IRoleSystemCreate[];
  menus: IMenuSeed[]; // Cambiado a plural y arreglo
}

export const initialData: SeedData = {
  permissions: [
    { name: 'ver_usuarios', description: 'Ver lista de usuarios' },
    { name: 'registrar_usuario', description: 'Registrar nuevo usuario' },

    { name: 'ver_asignaturas', description: 'Ver lista de asignaturas' },
    { name: 'registrar_asignatura', description: 'Registrar asignatura' },
    { name: 'editar_asignatura', description: 'Editar asignatura' },

    { name: 'gestionar_grupos', description: 'Administrar grupos y listas' },
    { name: 'editar_lista', description: 'Editar lista del sistema' },
    { name: 'editar_grupo', description: 'Editar grupo del sistema' },

    { name: 'ver_metricas', description: 'Ver métricas y reportes' },
    { name: 'exportar_datos', description: 'Exportar informes en PDF/Excel' },
  ],

  roles: [
    {
      name: ValidRole.ADMIN,
      description: 'Administrador con acceso total',
      permissions: [
        'ver_usuarios',
        'registrar_usuario',
        'ver_asignaturas',
        'registrar_asignatura',
        'editar_asignatura',
        'gestionar_grupos',
        'editar_lista',
        'editar_grupo',
        'ver_metricas',
        'exportar_datos',
      ],
    },
    {
      name: ValidRole.DOCENTE,
      description: 'Docente con acceso limitado',
      permissions: [
        'ver_asignaturas',
        'editar_asignatura',
        'gestionar_grupos',
        'ver_metricas',
      ],
    },
  ],

  menus: [
    // --- NIVEL RAÍZ (PADRES) ---
    {
      name: 'Panel Principal',
      route: '/dashboard',
      icon: 'LayoutDashboard',
      permission_name: 'ver_metricas',
      order_index: 1,
    },
    {
      name: 'Usuarios',
      icon: 'Users',
      permission_name: 'ver_usuarios',
      order_index: 2,
    },
    {
      name: 'Académico',
      icon: 'BookOpen',
      permission_name: 'ver_asignaturas',
      order_index: 3,
    },
    {
      name: 'Reportes',
      icon: 'BarChart3',
      permission_name: 'ver_metricas',
      order_index: 4,
    },

    // --- SUBMENÚS (HIJOS) ---

    // Hijos de Usuarios
    {
      name: 'Lista de Usuarios',
      route: '/dashboard/usuarios',
      permission_name: 'ver_usuarios',
      parent_name: 'Usuarios',
      order_index: 1,
    },
    {
      name: 'Nuevo Usuario',
      route: '/dashboard/usuarios/nuevo',
      permission_name: 'registrar_usuario',
      parent_name: 'Usuarios',
      order_index: 2,
    },

    // Hijos de Académico
    {
      name: 'Asignaturas',
      route: '/dashboard/academico/asignaturas',
      permission_name: 'ver_asignaturas',
      parent_name: 'Académico',
      order_index: 1,
    },
    {
      name: 'Gestión de Grupos',
      route: '/dashboard/academico/grupos',
      permission_name: 'gestionar_grupos',
      parent_name: 'Académico',
      order_index: 2,
    },

    // Hijos de Reportes
    {
      name: 'Estadísticas Globales',
      route: '/dashboard/reportes/stats',
      permission_name: 'ver_metricas',
      parent_name: 'Reportes',
      order_index: 1,
    },
    {
      name: 'Descargas',
      route: '/dashboard/reportes/descargas',
      permission_name: 'exportar_datos',
      parent_name: 'Reportes',
      order_index: 2,
    },
  ],
};
