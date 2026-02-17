import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ICurrentUser } from '../interface/current-user.interface';

interface RequestWithUser extends Request {
  user: ICurrentUser;
}

export const GetUser = createParamDecorator(
  (data: keyof ICurrentUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user)
      throw new UnauthorizedException(
        'User not found in request (AuthGuard absent)',
      );

    // 4. Si pides una propiedad específica, TS verificará que exista en ICurrentUser
    // Gracias a 'keyof ICurrentUser', si escribes @GetUser('id_erróneo') fallará en compilación.
    return data ? user[data] : user;
  },
);
