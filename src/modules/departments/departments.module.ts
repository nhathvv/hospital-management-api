import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { DepartmentService } from './services/department.service';
import { DepartmentRepository } from './repositories/department.repository';
import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentService, DepartmentRepository, PrismaService],
  exports: [DepartmentService],
})
export class DepartmentsModule {}
