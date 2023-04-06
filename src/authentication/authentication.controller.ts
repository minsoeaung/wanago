import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RequestWithUser } from './requestWithUser.interface';
import { LocalAuthGuard } from './localAuthentication.guard';
import { Response } from 'express';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';

@Controller('authentication')
// 'includeAll' does not work, cannot read property of undefined reading emit problem will occur
@UseInterceptors(ClassSerializerInterceptor)
// @SerializeOptions({ strategy: 'exposeAll' }) // expose all does not work ( ERROR [ExceptionsHandler] Cannot read properties of undefined (reading 'emit'))
// @SerializeOptions({ strategy: 'exposeAll' })
// Without this and only with @Exclude(), emit error will occur, reason unknown
// Actually this is caused by using express response object on login route
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  // This is utility route for client
  // It verifies JSON Web Tokens and return user data
  // So, the browser can check if the current token is valid and get the data of the currently logged-in user.
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @Post('register')
  create(
    // "skipMissingProperties" was set true globally,
    // but we want class-validator to check all field to send appropriate error message
    @Body(new ValidationPipe({ skipMissingProperties: false }))
    createUserDto: CreateUserDto,
  ) {
    return this.authenticationService.register(createUserDto);
  }

  // Because NestJS responds with 201 Created for POST requests by default
  @HttpCode(200)
  // The route handler will only be invoked if the user has been validated
  @UseGuards(LocalAuthGuard)
  @Post('log-in')
  // The req parameter will contain a user property (populated by Passport during the passport-local authentication flow)
  async login(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    // We used request and response of underlying native platform
    // So responding is all up to us
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return response.sendStatus(200);
  }
}
