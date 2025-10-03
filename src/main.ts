import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvsService } from './common/envs/envs-service';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()))
  await app.listen(EnvsService.getInstance().getPort());
}
bootstrap();
