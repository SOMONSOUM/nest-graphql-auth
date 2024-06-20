import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = this.authService.validate(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentails');
    }
    return user;
  }
}

// wana know flow

//  actually when we send the mutation  we go to the login function there but you know there is the guard  so first we need to go through the guard (middleware like) then the guard is mapping the context to a request object i.e email and password so the local startegy is able to parse the email and password  and triget the validate with those credential and return user

// after returning user what happens  automatically becomes the user context in every request that how we know who the user is     (Thank me later)
