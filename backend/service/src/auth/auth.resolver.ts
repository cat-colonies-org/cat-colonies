import { Args, Query, Resolver } from '@nestjs/graphql';
import { AccessToken } from './dto/access-token';
import { UserCredentials } from './dto/user-credentials';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { hasRoles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles-guard';
import { Roles } from 'src/domain/roles/entities/role.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @Query(() => AccessToken, { name: 'signin' })
  async signInUser(@Args('userCredentials') userCredentials: UserCredentials): Promise<AccessToken> {
    return this.service.signIn(userCredentials);
  }

  @Query(() => Boolean, { name: 'test' })
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  test(): boolean {
    return true;
  }
}
