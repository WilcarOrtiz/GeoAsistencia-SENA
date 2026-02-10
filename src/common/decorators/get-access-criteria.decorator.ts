import { ICurrentUser } from './../interface/current-user.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ValidRole } from '../constants/valid-role.enum';

export class AccessCriteria {
  is_active?: boolean;
}

interface RequestWithUser extends Request {
  user: ICurrentUser;
}

export const GetAccessCriteria = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AccessCriteria => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    const user = request.user;
    const roles = user?.roles || [];

    if (
      roles.includes(ValidRole.ADMIN) ||
      roles.includes(ValidRole.SUPER_ADMIN)
    ) {
      return {};
    }

    return { is_active: true };
  },
);
