import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto, RefreshTokenDto, RegisterDto } from '../dto/register.dto';
import { LoginResponse, RegisterResponse, TokenPayload } from '../interfaces/auth-response.interface';
import { UserRepository } from '../repositories/user.repository';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { TokenService } from './token.service';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';
import { Role, UserStatus } from '../../../common/enums';
import { ExceptionUtils } from '../../../common/utils/exception.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    const { username, password, fullName, phone, email } = dto;
    const existingUsername = await this.userRepository.existsByUsername(username);
    if (existingUsername) {
      ExceptionUtils.throwBadRequest(ERROR_MESSAGES.USER.USERNAME_TAKEN);
    }
    const existingEmail = await this.userRepository.existsByEmail(email);
    if (existingEmail) {
      ExceptionUtils.throwBadRequest(ERROR_MESSAGES.USER.EMAIL_TAKEN);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      username,
      password: hashedPassword,
      fullName,
      phone,
      status: UserStatus.ACTIVE,
      email,
      role: Role.Patient
    });
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken({ userId: user.id, role: user.role }),
      this.tokenService.generateRefreshToken({ userId: user.id })
    ]);
    await this.refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: this.tokenService.getRefreshTokenExpiry()
    });
    return { accessToken, refreshToken };
  }
  
  async login(dto: LoginDto): Promise<LoginResponse> {
    const { email, password } = dto;
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      ExceptionUtils.throwBadRequest(ERROR_MESSAGES.USER.USER_NOT_FOUND);
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      ExceptionUtils.throwBadRequest(ERROR_MESSAGES.USER.INVALID_PASSWORD);
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken({ userId: user.id, role: user.role }),
      this.tokenService.generateRefreshToken({ userId: user.id })
    ]);
    await this.refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: this.tokenService.getRefreshTokenExpiry()
    });
    const results = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
      accessToken,
      refreshToken
    }
    return results;
  }

  async getMe(authUser: TokenPayload) {
    const user = await this.userRepository.findById(authUser.userId)
    if (!user) {
      ExceptionUtils.throwNotFound(ERROR_MESSAGES.USER.USER_NOT_FOUND);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async refreshToken(dto: RefreshTokenDto) {
    const { refreshToken } = dto;
    let payload;
    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch (error) {
      ExceptionUtils.throwUnauthorized(ERROR_MESSAGES.AUTH.INVALID_REFRESH_TOKEN);
    }
    const existingToken = await this.refreshTokenRepository.findByToken(refreshToken);
    if (!existingToken) {
      ExceptionUtils.throwUnauthorized(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_NOT_FOUND);
    }
    if (existingToken.expiresAt < new Date()) {
      await this.refreshTokenRepository.delete(refreshToken);
      ExceptionUtils.throwUnauthorized(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_EXPIRED);
    }
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      ExceptionUtils.throwNotFound(ERROR_MESSAGES.USER.USER_NOT_FOUND);
    }
    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.tokenService.generateAccessToken({ userId: user.id, role: user.role }),
      this.tokenService.generateRefreshToken({ userId: user.id })
    ]);
    await this.refreshTokenRepository.delete(refreshToken);
    await this.refreshTokenRepository.create({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: existingToken.expiresAt
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }
}
