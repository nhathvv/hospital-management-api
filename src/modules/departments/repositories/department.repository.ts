import { Injectable } from '@nestjs/common';
import { Department, Prisma } from '@prisma/client';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { IBaseRepository } from '../../../common/repositories/base.repository.interface';

@Injectable()
export class DepartmentRepository implements IBaseRepository<Department> {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Department | null> {
    return this.prisma.department.findUnique({
      where: { id, deletedAt: null }
    });
  }

  async findAll(
    where?: Prisma.DepartmentWhereInput,
    orderBy?: Prisma.DepartmentOrderByWithRelationInput,
    skip?: number,
    take?: number
  ): Promise<Department[]> {
    return this.prisma.department.findMany({
      where: {
        ...where,
        deletedAt: null
      },
      orderBy: orderBy || { createdAt: Prisma.SortOrder.desc },
      skip,
      take
    });
  }

  async count(where?: Prisma.DepartmentWhereInput): Promise<number> {
    return this.prisma.department.count({
      where: {
        ...where,
        deletedAt: null
      }
    });
  }

  async create(data: Prisma.DepartmentCreateInput): Promise<Department> {
    return this.prisma.department.create({
      data
    });
  }

  async update(id: string, data: Prisma.DepartmentUpdateInput): Promise<Department> {
    return this.prisma.department.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<Department> {
    return this.prisma.department.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.prisma.department.count({
      where: { 
        name,
        deletedAt: null
      }
    });
    return count > 0;
  }

  async existsByNameExcludingId(name: string, excludeId: string): Promise<boolean> {
    const count = await this.prisma.department.count({
      where: {
        name,
        deletedAt: null,
        id: { not: excludeId }
      }
    });
    return count > 0;
  }
}
