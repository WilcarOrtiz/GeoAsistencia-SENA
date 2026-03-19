import { ValidRole } from '../enums/valid-role.enum';

export interface ICurrentUser {
  authId: string;
  ID_user: string;
  email: string;
  roles: { id: string; name: ValidRole }[];
  permissions: string[];
  permissionIds: string[];
  fullName: string;
  is_active: boolean;
}
