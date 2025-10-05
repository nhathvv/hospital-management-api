import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenExpiredError } from 'jsonwebtoken';
import { AuthGuard } from '@nestjs/passport';
import { ERROR_MESSAGES } from '../../common/constants/error-messages';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info instanceof TokenExpiredError) {
        throw new UnauthorizedException(ERROR_MESSAGES.USER.EXPIRED_TOKEN.toString());
      }
      throw new UnauthorizedException(info?.message || 'Unauthorized access');
    }
    return user;
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
