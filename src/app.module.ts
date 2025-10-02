import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvsService } from './common/envs/envs-service';

@Module({
  imports: [
    TypeOrmModule.forRoot(EnvsService.getInstance().getPostgresConfig()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
