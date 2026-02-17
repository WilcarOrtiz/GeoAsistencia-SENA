import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ValidRole } from '../constants/valid-role.enum';
import { PERMISSIONS_KEY } from '../constants/key-decorators';
import { ICurrentUser } from '../interface/current-user.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (!requiredPermissions.length) return true;

    const request = context
      .switchToHttp()
      .getRequest<{ user?: ICurrentUser }>();
    const user = request.user;
    if (!user) throw new ForbiddenException('User not found in request');

    const { roles = [], permissions = [] } = user;
    const elevatedRoles = new Set([ValidRole.SUPER_ADMIN, ValidRole.ADMIN]);
    if (roles.some((role) => elevatedRoles.has(role))) return true;

    const permissionSet = new Set(permissions);

    const missingPermissions = requiredPermissions.filter(
      (perm) => !permissionSet.has(perm),
    );

    if (missingPermissions.length)
      throw new ForbiddenException(
        `Missing permissions: [${missingPermissions.join(', ')}]`,
      );

    return true;
  }
}
