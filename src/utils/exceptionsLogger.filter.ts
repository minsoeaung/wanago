import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost } from '@nestjs/common';

export class ExceptionsLoggerFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
