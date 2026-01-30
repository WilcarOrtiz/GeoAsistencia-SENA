type roleValideName = 'super_admin' | 'admin' | 'docente' | 'estudiante';

export interface IRoleSystemCreate {
  name: roleValideName;
  description: string;
  permissions: string[];
}
