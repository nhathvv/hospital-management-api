import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from '../dto/register.dto';
import { LoginResponse, RegisterResponse, TokenPayload } from '../interfaces/auth-response.interface';
import { UserRepository } from '../repositories/user.repository';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { TokenService } from './token.service';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';
import { Role, UserStatus } from '../../../common/enums';

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
     throw new BadRequestException(ERROR_MESSAGES.USER.USERNAME_TAKEN);
    }
    const existingEmail = await this.userRepository.existsByEmail(email);
    if (existingEmail) {
      throw new BadRequestException(ERROR_MESSAGES.USER.EMAIL_TAKEN);
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
      throw new BadRequestException(ERROR_MESSAGES.USER.USER_NOT_FOUND);
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new BadRequestException(ERROR_MESSAGES.USER.INVALID_PASSWORD);
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
      throw new BadRequestException(ERROR_MESSAGES.USER.USER_NOT_FOUND);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
