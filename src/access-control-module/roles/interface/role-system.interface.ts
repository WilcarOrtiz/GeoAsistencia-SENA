import { ValidRole } from 'src/common/enums/valid-role.enum';
export interface IRoleSystemCreate {
  name: ValidRole;
  description: string;
  permissions: string[];
}
