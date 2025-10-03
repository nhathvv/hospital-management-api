import { Injectable } from '@nestjs/common';
import { Prisma, RefreshToken } from '@prisma/client';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({
      where: { token }
    });
  }
  async findByUserId(userId: string): Promise<RefreshToken[]> {
    return this.prisma.refreshToken.findMany({
      where: { userId }
    });
  }
  async create(data: Prisma.RefreshTokenUncheckedCreateInput): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data
    });
  }
  async delete(token: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.delete({
      where: { token }
    });
  }

  async deleteByUserId(userId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.refreshToken.deleteMany({
      where: { userId }
    });
  }
  async deleteExpired(): Promise<Prisma.BatchPayload> {
    return this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }
}
