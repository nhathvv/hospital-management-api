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
  getNodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }
  getPostgresConfig() {
    return {
      type: 'postgres' as const,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 3000,
    };
  }
}
