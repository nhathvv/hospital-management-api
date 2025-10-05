import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guards';

export function BearerJwt(...args: string[]) {
  return applyDecorators(ApiBearerAuth(), UseGuards(JwtAuthGuard));
}
