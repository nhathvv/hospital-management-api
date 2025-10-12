import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/enums';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ExceptionUtils } from '../../common/utils/exception.utils';
import { TokenPayload } from '../../modules/auth/interfaces/auth-response.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as TokenPayload;
    if (!user) {
      ExceptionUtils.throwUnauthorized('User not authenticated');
    }
    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      ExceptionUtils.throwForbidden('Insufficient permissions');
    }
    return true;
  }
}
