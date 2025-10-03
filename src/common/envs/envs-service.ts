import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentVariables } from './env-variables';

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
  getJwtConfig() {
    return {
      accessSecret: process.env.JWT_ACCESS_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      accessExpiry: process.env.JWT_ACCESS_EXPIRY,
      refreshExpiry: process.env.JWT_REFRESH_EXPIRY,
    };
  }
}
