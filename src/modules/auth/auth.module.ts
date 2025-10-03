import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { UserRepository } from './repositories/user.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    UserRepository,
    RefreshTokenRepository,
    PrismaService
  ],
  exports: [AuthService, TokenService]
})
export class AuthModule {}
