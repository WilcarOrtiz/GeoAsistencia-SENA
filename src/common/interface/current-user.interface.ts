import { ValidRole } from '../constants/valid-role.enum';

export interface ICurrentUser {
  authId: string;
  ID_user: string;
  email: string;
  roles: ValidRole[];
  permissions: string[];
}
