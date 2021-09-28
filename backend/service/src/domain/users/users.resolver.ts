import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { UpdateUserInput } from './dto/update-user.input';
import { RemoveUserResult } from './dto/remove-user.result';
import { FindUsersArgs } from './dto/find-users.args';
import { FindUsersResult } from './dto/find-users.result';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseResolver } from 'src/common/base-resolver';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { Roles } from '../roles/entities/role.entity';
import { RolesGuard } from 'src/auth/guards/roles-guard';

@Resolver(() => User)
export class UsersResolver extends BaseResolver<User> {
  constructor(service: UsersService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, User.name);
  }

  // #region Subscriptions
  @Subscription(() => User)
  userAdded() {
    return this.addedEvent();
  }

  @Subscription(() => User)
  userUpdated() {
    return this.updatedEvent();
  }

  @Subscription(() => User)
  userRemoved() {
    return this.removedEvent();
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => User)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.create(createUserInput);
  }

  @Mutation(() => User)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<User> {
    return this.update(updateUserInput);
  }

  @Mutation(() => RemoveUserResult)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async removeUser(@Args('id', { type: () => Int }) id: number): Promise<RemoveUserResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindUsersResult, { name: 'users', nullable: true })
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async findUsers(@Args() filter: FindUsersArgs): Promise<FindUsersResult> {
    return this.find(filter);
  }

  @Query(() => User, { name: 'user', nullable: true })
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  findOneUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.findOne(id);
  }
  // #endregion Queries
}
