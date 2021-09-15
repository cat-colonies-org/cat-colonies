import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Environment } from './entities/environment.entity';
import { EnvironmentsService } from './environments.service';
import { CreateEnvironmentInput } from './dto/create-environment.input';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { UpdateEnvironmentInput } from './dto/update-environment.input';
import { RemoveEnvironmentResult } from './dto/remove-environment.result';
import { FindEnvironmentsArgs } from './dto/find-environments.args';
import { FindEnvironmentsResult } from './dto/find-environments.result';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseResolver } from 'src/common/base-resolver';

@Resolver(() => Environment)
export class EnvironmentsResolver extends BaseResolver<Environment> {
  constructor(service: EnvironmentsService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, Environment.name);
  }

  // #region Subscriptions
  @Subscription(() => Environment)
  environmentAdded() {
    return this.addedEvent();
  }

  @Subscription(() => Environment)
  environmentUpdated() {
    return this.updatedEvent();
  }

  @Subscription(() => Environment)
  environmentRemoved() {
    return this.removedEvent();
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => Environment)
  async createEnvironment(
    @Args('createEnvironmentInput') createEnvironmentInput: CreateEnvironmentInput,
  ): Promise<Environment> {
    return this.create(createEnvironmentInput);
  }

  @Mutation(() => Environment)
  async updateEnvironment(
    @Args('updateEnvironmentInput') updateEnvironmentInput: UpdateEnvironmentInput,
  ): Promise<Environment> {
    return this.update(updateEnvironmentInput);
  }

  @Mutation(() => RemoveEnvironmentResult)
  async removeEnvironment(@Args('id', { type: () => Int }) id: number): Promise<RemoveEnvironmentResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindEnvironmentsResult, { name: 'environments', nullable: true })
  async findEnvironments(@Args() filter: FindEnvironmentsArgs): Promise<FindEnvironmentsResult> {
    return this.find(filter);
  }

  @Query(() => Environment, { name: 'environment', nullable: true })
  findOneEnvironment(@Args('id', { type: () => Int }) id: number): Promise<Environment> {
    return this.findOne(id);
  }
  // #endregion Queries
}
