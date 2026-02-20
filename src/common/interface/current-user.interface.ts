import { ValidRole } from '../enums/valid-role.enum';

export interface ICurrentUser {
  authId: string;
  ID_user: string;
  email: string;
  roles: ValidRole[];
  permissions: string[];
}
