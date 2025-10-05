import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { IBaseRepository } from '../../../common/repositories/base.repository.interface';

@Injectable()
export class UserRepository implements IBaseRepository<User> {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data
    });
  }
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }
  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id }
    });
  }
  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { username }
    });
    return count > 0;
  }
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email }
    });
    return count > 0;
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }
}
