import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenExpiredError } from 'jsonwebtoken';
import { AuthGuard } from '@nestjs/passport';
import { ERROR_MESSAGES } from '../../common/constants/error-messages';
import { ExceptionUtils } from '../../common/utils/exception.utils';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info instanceof TokenExpiredError) {
        ExceptionUtils.throwUnauthorized(ERROR_MESSAGES.USER.EXPIRED_TOKEN.toString());
      }
      ExceptionUtils.throwUnauthorized(info?.message || 'Unauthorized access');
    }
    return user;
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
