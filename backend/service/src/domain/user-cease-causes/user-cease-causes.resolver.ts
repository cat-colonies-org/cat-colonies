import { BaseResolver } from 'src/common/base-resolver';
import { CreateUserCeaseCauseInput } from './dto/create-user-cease-cause.input';
import { FindUserCeaseCauseArgs } from './dto/find-user-cease-causes.args';
import { FindUserCeaseCausesResult } from './dto/find-user-cease-causes.result';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { PubSubEngine } from 'graphql-subscriptions';
import { RemoveUserCeaseCauseResult } from './dto/remove-user-cease-cuase.result';
import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Roles } from '../roles/entities/role.entity';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { UpdateUserCeaseCauseInput } from './dto/update-user-cease-cause.input';
import { UserCeaseCause } from './entities/user-cease-cause.entity';
import { UserCeaseCausesService } from './user-cease-causes.service';

@Resolver(() => UserCeaseCause)
export class UserCeaseCausesResolver extends BaseResolver<UserCeaseCause> {
  constructor(service: UserCeaseCausesService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, UserCeaseCause.name);
  }

  // #region Subscriptions
  @Subscription(() => UserCeaseCause)
  userCeaseCauseAdded() {
    return this.addedEvent();
  }

  @Subscription(() => UserCeaseCause)
  userCeaseCauseUpdated() {
    return this.updatedEvent();
  }

  @Subscription(() => UserCeaseCause)
  userCeaseCauseRemoved() {
    return this.removedEvent();
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => UserCeaseCause)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createUserCeaseCause(
    @Args('createUserCeaseCauseInput') createUserCeaseCauseInput: CreateUserCeaseCauseInput,
  ): Promise<UserCeaseCause> {
    return this.create(createUserCeaseCauseInput);
  }

  @Mutation(() => UserCeaseCause)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateUserCeaseCause(
    @Args('updateUserCeaseCauseInput') updateUserCeaseCauseInput: UpdateUserCeaseCauseInput,
  ): Promise<UserCeaseCause> {
    return this.update(updateUserCeaseCauseInput);
  }

  @Mutation(() => RemoveUserCeaseCauseResult)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async removeUserCeaseCause(@Args('id', { type: () => Int }) id: number): Promise<RemoveUserCeaseCauseResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindUserCeaseCausesResult, { name: 'userCeaseCauses', nullable: true })
  @UseGuards(GqlAuthGuard)
  async findUserCeaseCauses(@Args() filter: FindUserCeaseCauseArgs): Promise<FindUserCeaseCausesResult> {
    return this.find(filter);
  }

  @Query(() => UserCeaseCause, { name: 'userCeaseCause', nullable: true })
  @UseGuards(GqlAuthGuard)
  findOneUserCeaseCause(@Args('id', { type: () => Int }) id: number): Promise<UserCeaseCause> {
    return this.findOne(id);
  }
  // #endregion Queries
}
