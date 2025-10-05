import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { UserRepository } from './repositories/user.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    UserRepository,
    RefreshTokenRepository,
    PrismaService,
    JwtStrategy
  ],
  exports: [AuthService, TokenService]
})
export class AuthModule {}
