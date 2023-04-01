import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // What if lots of module exists?
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(3000);
}

bootstrap();
