import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY } from '../constants/key-decorators';

export const RequiredPermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
