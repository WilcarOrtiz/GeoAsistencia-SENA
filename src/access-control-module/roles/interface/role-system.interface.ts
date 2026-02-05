import { ValidRole } from 'src/common/constants/valid-role.enum';
export interface IRoleSystemCreate {
  name: ValidRole;
  description: string;
  permissions: string[];
}
