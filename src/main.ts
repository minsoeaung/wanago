import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  // PUT replaces an entity, PATCH partially modify it
  // Setting skipMissingProperties to true in this validation pipe will make our DTO
  // skip all missing properties for both PUT and PATCH routes.
  // Read handling patch of https://wanago.io/2020/06/01/api-nestjs-error-handling-validation/

  // SKIP SKIP SKIP missing, what will happen for PUT and PATCH

  // If skip, typeorm try to save it and return 500
  // If dont skip, class-validator will catch it and return appropriate response

  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());
  await app.listen(config.get('PORT'));
}

bootstrap();
