import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DepartmentService } from './services/department.service';
import { CreateDepartmentDto, QueryDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { UserRole } from '../../shared/decorators/user-role.decorator';
import { Role } from '../../common/enums';

@ApiTags('departments')
@Controller('departments')
@UserRole(Role.Admin)
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo phòng ban mới' })
  @ApiBody({ type: CreateDepartmentDto })
  async create(@Body() dto: CreateDepartmentDto) {
    return this.departmentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách phòng ban' })
  @ApiQuery({ type: QueryDepartmentDto })
  async findAll(@Query() query: QueryDepartmentDto) {
    return this.departmentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin phòng ban theo ID' })
  @ApiParam({ name: 'id', description: 'ID của phòng ban', example: '123e4567-e89b-12d3-a456-426614174000' })
  async findById(@Param('id') id: string) {
    return this.departmentService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin phòng ban' })
  @ApiParam({ name: 'id', description: 'ID của phòng ban', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateDepartmentDto })
  async update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return this.departmentService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa phòng ban (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID của phòng ban', example: '123e4567-e89b-12d3-a456-426614174000' })
  async delete(@Param('id') id: string) {
    return this.departmentService.delete(id);
  }
}
