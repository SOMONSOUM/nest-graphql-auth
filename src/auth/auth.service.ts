import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ERRORSTATUSCODE, ERROR_MESSAGES } from 'src/common/errors';
import { GraphQLError } from 'graphql';

@Injectable()
export class AuthService {
  createUserWithEmail() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User) private readonly userRepositary: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async validate(email: string, password: string) {
    const user = await this.userRepositary.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND, {
        extensions: {
          code: ERRORSTATUSCODE.UNAUTHENTICATED,
        },
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    return isPasswordCorrect ? user : null;
  }

  async loginUser(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET') || '',
      }),
      user,
    };
  }

  async verifyToken(token: string) {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    });

    if (!decoded) {
      return new UnauthorizedException('Invalid credentials');
    }
    const user = await this.userRepositary.findOne({
      where: { id: decoded.id },
    });
    return user;
  }
}
