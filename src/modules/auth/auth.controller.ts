import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LoginDto, RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthUser } from '../../shared/decorators/auth-user.decorator';
import type { TokenPayload } from '../../modules/auth/interfaces/auth-response.interface';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin người dùng' })
  async getMe(@AuthUser() authUser: TokenPayload) {
    return this.authService.getMe(authUser);
  }
}
