import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LoginDto, RegisterDto } from './dto/register.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto)
  }
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto)
  }
}
