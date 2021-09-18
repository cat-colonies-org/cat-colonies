import { Args, Query, Resolver } from '@nestjs/graphql';
import { AccessToken } from './dto/access-token';
import { UserCredentials } from './user-credentials';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @Query(() => AccessToken, { name: 'signin' })
  async signInUser(@Args('userCredentials') userCredentials: UserCredentials): Promise<AccessToken> {
    return this.service.signIn(userCredentials);
  }
}
