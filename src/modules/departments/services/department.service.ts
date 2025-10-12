import { Injectable } from '@nestjs/common';
import { Department, Prisma } from '@prisma/client';
import { DepartmentRepository } from '../repositories/department.repository';
import { CreateDepartmentDto, QueryDepartmentDto, UpdateDepartmentDto } from '../dto/department.dto';
import { ExceptionUtils } from '../../../common/utils/exception.utils';
import { DepartmentStatus } from '../../../common/enums';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';
import { SortOrder } from '../../../common/dto/sorting.dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const { name, status } = dto;

    const existingName = await this.departmentRepository.existsByName(name);
    if (existingName) {
      ExceptionUtils.throwBadRequest(ERROR_MESSAGES.DEPARTMENT.NAME_ALREADY_EXISTS);
    }

    return this.departmentRepository.create({
      name,
      status: status || DepartmentStatus.ACTIVE,
    });
  }

  async findAll(query: QueryDepartmentDto) {
    const { status, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = SortOrder.DESC } = query;

    const where: Prisma.DepartmentWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: Prisma.QueryMode.insensitive,
      };
    }

    const orderBy: Prisma.DepartmentOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [items, total] = await Promise.all([
      this.departmentRepository.findAll(where, orderBy, skip, take),
      this.departmentRepository.count(where),
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    return {
      items,
      message: 'Departments retrieved successfully',
      pagination: {
        total,
        page: Number(page),
        perPage: Number(limit),
        totalPages,
      },
    };
  }

  async findById(id: string): Promise<Department> {
    const department = await this.departmentRepository.findById(id);
    if (!department) {
      ExceptionUtils.throwNotFound(ERROR_MESSAGES.DEPARTMENT.NOT_FOUND);
    }
    return department;
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.departmentRepository.findById(id);
    if (!department) {
      ExceptionUtils.throwNotFound(ERROR_MESSAGES.DEPARTMENT.NOT_FOUND);
    }

    if (dto.name) {
      const existingName = await this.departmentRepository.existsByNameExcludingId(dto.name, id);
      if (existingName) {
        ExceptionUtils.throwBadRequest(ERROR_MESSAGES.DEPARTMENT.NAME_ALREADY_EXISTS);
      }
    }

    return this.departmentRepository.update(id, dto);
  }

  async delete(id: string): Promise<Department> {
    const department = await this.departmentRepository.findById(id);
    if (!department) {
      ExceptionUtils.throwNotFound(ERROR_MESSAGES.DEPARTMENT.NOT_FOUND);
    }

    return this.departmentRepository.delete(id);
  }
}
