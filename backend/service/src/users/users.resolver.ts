import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { FindAllUsersArgs } from './dto/find-users.args';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { RemoveUserResult } from './dto/remove-user.result';

const USER_ADDED_EVENT = 'userAdded';
const USER_UPDATED_EVENT = 'userUpdated';
const USER_REMOVED_EVENT = 'userRemoved';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService, @Inject(PUB_SUB) private readonly pubSub: RedisPubSub) {}

  // #region Subscriptions
  @Subscription(() => User)
  colonyAdded() {
    return this.pubSub.asyncIterator(USER_ADDED_EVENT);
  }

  @Subscription(() => User)
  colonyUpdated() {
    return this.pubSub.asyncIterator(USER_UPDATED_EVENT);
  }

  @Subscription(() => User)
  colonyRemoved() {
    return this.pubSub.asyncIterator(USER_REMOVED_EVENT);
  }
  // #endregion

  // #region Mutations
  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    const user = await this.usersService.create(createUserInput);
    user && this.pubSub.publish(USER_ADDED_EVENT, { [USER_ADDED_EVENT]: user });
    return user;
  }

  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.usersService.update(updateUserInput.id, updateUserInput);
    user && this.pubSub.publish(USER_UPDATED_EVENT, { [USER_UPDATED_EVENT]: user });
    return user;
  }

  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => Int }) id: number): Promise<RemoveUserResult> {
    const user = await this.usersService.findOne(id);
    if (!user) return { result: false };

    const result = await this.usersService.remove(id);
    result && this.pubSub.publish(USER_REMOVED_EVENT, { [USER_REMOVED_EVENT]: user });

    return { result };
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => [User], { name: 'users' })
  find(@Args() filter: FindAllUsersArgs): Promise<User[]> {
    return this.usersService.find(filter);
  }

  @Query(() => User, { name: 'user', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }
  // #endregion Queries
}
