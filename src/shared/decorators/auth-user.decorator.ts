import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '../../modules/auth/interfaces/auth-response.interface';

export const AuthUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as TokenPayload;
  return data ? user?.[data] : user;
});
