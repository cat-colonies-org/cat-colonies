import { Args, Query, Resolver } from '@nestjs/graphql';
import { AccessToken } from './dto/access-token';
import { UserCredentials } from './dto/user-credentials';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @Query(() => AccessToken, { name: 'signin' })
  async signInUser(@Args('userCredentials') userCredentials: UserCredentials): Promise<AccessToken> {
    return this.service.signIn(userCredentials);
  }

  @Query(() => Boolean, { name: 'test' })
  @UseGuards(GqlAuthGuard)
  test(): boolean {
    return true;
  }
}
