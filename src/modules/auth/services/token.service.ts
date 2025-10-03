import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { RefreshTokenPayload, TokenPayload} from '../interfaces/auth-response.interface';
import { EnvsService } from '../../../common/envs/envs-service';

@Injectable()
export class TokenService {
  private readonly accessTokenSecret = EnvsService.getInstance().getJwtConfig().accessSecret;
  private readonly refreshTokenSecret = EnvsService.getInstance().getJwtConfig().refreshSecret;
  private readonly accessTokenExpiry = EnvsService.getInstance().getJwtConfig().accessExpiry;
  private readonly refreshTokenExpiry = EnvsService.getInstance().getJwtConfig().refreshExpiry;

  generateAccessToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: this.accessTokenExpiry as any
    };
    return jwt.sign(payload, this.accessTokenSecret as string, options);
  }
  generateRefreshToken(payload: RefreshTokenPayload): string {
    const options: SignOptions = {
      expiresIn: this.refreshTokenExpiry as any
    };
    return jwt.sign(payload, this.refreshTokenSecret as string, options);
  }
  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, this.accessTokenSecret as string) as TokenPayload;
  }
  verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, this.refreshTokenSecret as string) as RefreshTokenPayload;
  }
  getRefreshTokenExpiry(): Date {
    const days = parseInt(this.refreshTokenExpiry as string) || 60;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    return expiryDate;
  }
}
