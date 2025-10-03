import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from '../dto/register.dto';
import { RegisterResponse } from '../interfaces/auth-response.interface';
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
    const { username, password, fullName, phone, status } = dto;
    const existingUsername = await this.userRepository.existsByUsername(username);
    if (existingUsername) {
     throw new BadRequestException(ERROR_MESSAGES.USER.USERNAME_TAKEN);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      username,
      password: hashedPassword,
      fullName,
      phone,
      status: status || UserStatus.ACTIVE,
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
  async login(dto: LoginDto){
    const { username, password } = dto;
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.USER.USER_NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
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
    return { accessToken, refreshToken };
  }
}
