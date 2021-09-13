import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { UpdateUserInput } from './dto/update-user.input';
import { RemoveUserResult } from './dto/remove-user.result';
import { FindUsersArgs } from './dto/find-users.args';
import { FindUsersResult } from './dto/find-users.result';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseResolver } from 'src/common/base-resolver';

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
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.create(createUserInput);
  }

  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<User> {
    return this.update(updateUserInput);
  }

  @Mutation(() => RemoveUserResult)
  async removeUser(@Args('id', { type: () => Int }) id: number): Promise<RemoveUserResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindUsersResult, { name: 'users', nullable: true })
  async findUsers(@Args() filter: FindUsersArgs): Promise<FindUsersResult> {
    return this.find(filter);
  }

  @Query(() => User, { name: 'user', nullable: true })
  findOneUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.findOne(id);
  }
  // #endregion Queries
}
