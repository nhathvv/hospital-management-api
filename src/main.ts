import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvsService } from './common/envs/envs-service';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { config } from './common/configs/swagger.cnf';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config();
  EnvsService.getInstance().validateEnv(process.env);
  const app = await NestFactory.create(AppModule, {cors: true});
  if (EnvsService.getInstance().isDevelopmentMode()) {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }
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
