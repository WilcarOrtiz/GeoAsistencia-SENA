import { IPermissionSystemCreate } from 'src/access-control-module/permissions/permission-system.interface';
import { IRoleSystemCreate } from 'src/access-control-module/roles/role-system.interface';
import { ValidRole } from 'src/common/constants/valid-role.enum';

interface SeedData {
  permissions: IPermissionSystemCreate[];
  roles: IRoleSystemCreate[];
}
export const initialData: SeedData = {
  permissions: [
    {
      name: 'registrar_asignatura',
      description: 'registrar asignatura del sistema',
    },
    {
      name: 'editar_asignatura',
      description: 'editar asignatura del sistema',
    },
    {
      name: 'registrar_usuario',
      description: 'registrar usuario del sistema',
    },
    {
      name: 'ver_metricas',
      description: 'ver_metricas del sistema',
    },
    {
      name: 'editar_lista',
      description: 'editar_lista del sistema',
    },
    {
      name: 'editar_grupo',
      description: 'editar_grupo del sistema',
    },
  ],

  roles: [
    {
      name: ValidRole.ADMIN,
      description: 'Administrador',
      permissions: [
        'registrar_usuario',
        'registrar_asignatura',
        'editar_asignatura',
        'editar_grupo',
        'editar_lista',
        'ver_metricas',
      ],
    },
    {
      name: ValidRole.DOCENTE,
      description: 'Docente',
      permissions: ['editar_asignatura', 'ver_metricas'],
    },
  ],
};
