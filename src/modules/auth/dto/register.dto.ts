import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserStatus } from '../../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({ example: 'nhathv' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  @ApiProperty({ example: '123456x@X' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'Hoang Van Nhat' })
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty({ example: '0909090909' })
  phone: string;

  @IsOptional()
  @IsEnum(UserStatus)
  @ApiProperty({ example: UserStatus.ACTIVE, enum: UserStatus })
  status?: UserStatus;
}
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'nhathv' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456x@X' })
  password: string;
}