import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentVariables } from 'src/common/envs/env-variables';

export class EnvsService {
  private static _instance: EnvsService;
  private constructor() {}
  public static getInstance(): EnvsService {
    if (!this._instance) {
      this._instance = new EnvsService();
    }
    return this._instance;
  }
  validateEnv(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });
    if (errors.length > 0) {
      process.exit(1);
    }
    return validatedConfig;
  }
  getPort(): number {
    return Number(process.env.PORT) || 3000;
  }
  getNodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }
}
