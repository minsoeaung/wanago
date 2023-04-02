import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthenticationService {
  // We used another service inside this service
  // To do this, we imported UsersModule in our AuthenticationModule
  // UsersModule exported UsersService
  constructor(private readonly usersService: UsersService) {}

  async register(userDto: CreateUserDto) {
    const hashPassword = await bcrypt.hash(userDto.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...userDto,
        password: hashPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (e) {
      if (e.code === PostgresErrorCode.UniqueViolation) {
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

  async getAuthenticatedUser(email: string, hashedPassword: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);
      await this.verifyPassword(user.password, hashedPassword);
      user.password = undefined;
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
}
