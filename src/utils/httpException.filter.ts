import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

// This filter run only for not found exception
@Catch(NotFoundException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    // const request = context.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;

    response.status(status).json({
      message,
      statusCode: status,
      time: new Date().toISOString(),
    });
  }
}
