import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { DatabaseModule } from './database/database.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionsLoggerFilter } from './utils/exceptionsLogger.filter';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    PostsModule,
    UsersModule,
    AuthenticationModule,
    CategoriesModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggerFilter,
    },
  ],
})
export class AppModule {}
