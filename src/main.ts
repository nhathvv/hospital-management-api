import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvsService } from 'src/common/envs/envs-service';
import * as dotenv from 'dotenv';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  await app.listen(EnvsService.getInstance().getPort());
}
bootstrap();
