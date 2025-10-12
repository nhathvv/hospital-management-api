import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { DepartmentStatus } from '../../../common/enums';
import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { Paginate } from '../../../common/dto/paginate.dto';
import { Sorting } from '../../../common/dto/sorting.dto';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'Khoa Nội' })
  name: string;

  @IsEnum(DepartmentStatus)
  @IsOptional()
  @ApiProperty({ example: DepartmentStatus.ACTIVE, enum: DepartmentStatus, required: false })
  status?: DepartmentStatus;
}

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}

class QueryDepartmentBase {
  @IsEnum(DepartmentStatus)
  @IsOptional()
  @ApiProperty({ example: DepartmentStatus.ACTIVE, enum: DepartmentStatus, required: false })
  status?: DepartmentStatus;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Khoa', required: false })
  search?: string;
}

export class QueryDepartmentDto extends IntersectionType(
  QueryDepartmentBase,
  Paginate,
  Sorting,
) {}
