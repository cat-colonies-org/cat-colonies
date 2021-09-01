import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { EnvironmentsService } from './environments.service';
import { CreateEnvironmentInput } from './dto/create-environment.input';
import { UpdateEnvironmentInput } from './dto/update-environment.input';
import { Environment } from './entities/environment.entity';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { RemoveEnvironmentResult } from './dto/remove-environment-result';
import { FindEnvironmentArgs } from './dto/find-environments.args';

const ENVIRONMENT_ADDED_EVENT = 'environmentAdded';
const ENVIRONMENT_UPDATED_EVENT = 'environmentUpdated';
const ENVIRONMENT_REMOVED_EVENT = 'environmentRemoved';

@Resolver(() => Environment)
export class EnvironmentsResolver {
  constructor(
    private readonly environmentsService: EnvironmentsService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  // #region Subscriptions
  @Subscription(() => Environment)
  environmentAdded() {
    return this.pubSub.asyncIterator(ENVIRONMENT_ADDED_EVENT);
  }

  @Subscription(() => Environment)
  environmentUpdated() {
    return this.pubSub.asyncIterator(ENVIRONMENT_UPDATED_EVENT);
  }

  @Subscription(() => Environment)
  environmentRemoved() {
    return this.pubSub.asyncIterator(ENVIRONMENT_REMOVED_EVENT);
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => Environment)
  async createEnvironment(
    @Args('createEnvironmentInput') createEnvironmentInput: CreateEnvironmentInput,
  ): Promise<Environment> {
    const environment = await this.environmentsService.create(createEnvironmentInput);
    environment && this.pubSub.publish(ENVIRONMENT_ADDED_EVENT, { [ENVIRONMENT_ADDED_EVENT]: environment });
    return environment;
  }

  @Mutation(() => Environment)
  async updateEnvironment(
    @Args('updateEnvironmentInput') updateEnvironmentInput: UpdateEnvironmentInput,
  ): Promise<Environment> {
    const environment = await this.environmentsService.update(updateEnvironmentInput.id, updateEnvironmentInput);
    environment && this.pubSub.publish(ENVIRONMENT_UPDATED_EVENT, { [ENVIRONMENT_UPDATED_EVENT]: environment });
    return environment;
  }

  @Mutation(() => Environment)
  async removeEnvironment(@Args('id', { type: () => Int }) id: number): Promise<RemoveEnvironmentResult> {
    const environment = await this.environmentsService.findOne(id);
    if (!environment) return { result: false };

    const result = await this.environmentsService.remove(id);
    result && this.pubSub.publish(ENVIRONMENT_REMOVED_EVENT, { [ENVIRONMENT_REMOVED_EVENT]: environment });

    return { result };
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => [Environment], { name: 'environments', nullable: true })
  find(@Args() filter: FindEnvironmentArgs): Promise<Environment[]> {
    return this.environmentsService.find(filter);
  }

  @Query(() => Environment, { name: 'environment', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.environmentsService.findOne(id);
  }
  // #endregion Queries
}
