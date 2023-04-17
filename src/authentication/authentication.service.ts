import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './tokenPayload.interface';

@Injectable()
export class AuthenticationService {
  // We used another service inside this service
  // To do this, we imported UsersModule in our AuthenticationModule
  // UsersModule exported UsersService
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(userDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    try {
      return await this.usersService.create({
        ...userDto,
        password: hashedPassword,
      });
    } catch (e) {
      if (e.code === '23505') {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // This method is created for use inside PASSPORT STRATEGY
  async getAuthenticatedUser(email: string, hashedPassword: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);
      await this.verifyPassword(user.password, hashedPassword);
      return user;
    } catch (e) {
      // Email is wrong
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Private because this method is only be used inside this class
  private async verifyPassword(plainPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      hashedPassword,
      plainPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn:
        this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME') + 's',
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  getCookieWithJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') + 's',
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;
    return {
      cookie,
      token,
    };
  }

  // Nice
  getCookieForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
