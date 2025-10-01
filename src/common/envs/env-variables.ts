import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  NODE_ENV: string;
}
