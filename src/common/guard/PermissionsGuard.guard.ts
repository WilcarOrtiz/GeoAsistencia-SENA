/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ValidRole } from '../constants/valid-role.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no encontrado en la petición');
    }

    const userRoles: string[] = user.roles || [];
    const userPermissions: string[] = user.permissions || [];

    if (
      userRoles.includes(ValidRole.SUPER_ADMIN) ||
      userRoles.includes(ValidRole.ADMIN)
    ) {
      return true;
    }

    const hasAllRequiredPermissions = requiredPermissions.every((perm) =>
      userPermissions.includes(perm),
    );

    if (!hasAllRequiredPermissions) {
      const missing = requiredPermissions.filter(
        (p) => !userPermissions.includes(p),
      );
      throw new ForbiddenException(
        `No tienes los permisos suficientes. Faltan: [${missing.join(', ')}]`,
      );
    }

    return true;
  }
}
