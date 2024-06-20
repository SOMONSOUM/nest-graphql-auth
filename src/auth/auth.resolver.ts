import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './types/auth.types';
import { UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { GqlAuthGuard } from './guards/gql.auth.guard';
import { Public } from './decorators/public.decorator';
import { Me } from './decorators/me.decorator';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => LoginResponse)
  @Public()
  @UseGuards(GqlAuthGuard)
  async LoginUser(
    @Args('loginUserInput') loginUserInput: LoginDto,
    @Context() context,
  ): Promise<LoginResponse> {
    return this.authService.loginUser(context.user);
  }

  @Query(() => User)
  async me(@Me() user: User): Promise<User> {
    return this.userService.findOne(user.id);
  }
}
