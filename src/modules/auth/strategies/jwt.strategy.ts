import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvsService } from '../../../common/envs/envs-service';
import { TokenPayload } from '../interfaces/auth-response.interface';
import { ExceptionUtils } from '../../../common/utils/exception.utils';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const accessSecret = EnvsService.getInstance().getJwtConfig().accessSecret;
    if (!accessSecret) {
      throw new Error('JWT_ACCESS_SECRET is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accessSecret,
    });
  }
  async validate(payload: any): Promise<TokenPayload> {
    if (!payload.userId || !payload.role) {
      ExceptionUtils.throwUnauthorized(ERROR_MESSAGES.AUTH.INVALID_TOKEN_PAYLOAD);
    }
    return { userId: payload.userId, role: payload.role };
  }
}
