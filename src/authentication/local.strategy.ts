import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from './authentication.service';

// Who will use this service? (by localAuthentication guard)
// Service using another service
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  // Can use this service because in auth module, we set it up
  constructor(private readonly authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    return this.authenticationService.getAuthenticatedUser(email, password);
  }
}
