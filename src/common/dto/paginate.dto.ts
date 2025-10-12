import { Optional } from '@nestjs/common';
import { IsNumberString, IsOptional } from 'class-validator';

export class Paginate {
  @IsOptional()
  // @IsNumberString()
  limit?: number = 10;
  @IsOptional()
  // @IsNumberString()
  page?: number = 1;
}
