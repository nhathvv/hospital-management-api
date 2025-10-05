import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvsService } from '../../../common/envs/envs-service';
import { TokenPayload } from '../interfaces/auth-response.interface';

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
      throw new UnauthorizedException('Invalid token payload');
    }
    return { userId: payload.userId, role: payload.role };
  }
}
