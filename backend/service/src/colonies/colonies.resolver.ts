import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { ColoniesService } from './colonies.service';
import { Colony } from './entities/colony.entity';
import { CreateColonyInput } from './dto/create-colony.input';
import { UpdateColonyInput } from './dto/update-colony.input';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { FindColoniesArgs } from './dto/find-colonies.args';
import { RemoveColonyResult } from './dto/remove-colony.result';

const COLONY_ADDED_EVENT = 'colonyAdded';
const COLONY_UPDATED_EVENT = 'colonyUpdated';
const COLONY_REMOVED_EVENT = 'colonyRemoved';

@Resolver(() => Colony)
export class ColoniesResolver {
  constructor(
    private readonly coloniesService: ColoniesService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  // #region Subscriptions
  @Subscription(() => Colony)
  colonyAdded() {
    return this.pubSub.asyncIterator(COLONY_ADDED_EVENT);
  }

  @Subscription(() => Colony)
  colonyUpdated() {
    return this.pubSub.asyncIterator(COLONY_UPDATED_EVENT);
  }

  @Subscription(() => Colony)
  colonyRemoved() {
    return this.pubSub.asyncIterator(COLONY_REMOVED_EVENT);
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => Colony)
  async createColony(@Args('createColonyInput') createColonyInput: CreateColonyInput): Promise<Colony> {
    const colony = await this.coloniesService.create(createColonyInput);
    colony && this.pubSub.publish(COLONY_ADDED_EVENT, { [COLONY_ADDED_EVENT]: colony });
    return colony;
  }

  @Mutation(() => Colony)
  async updateColony(@Args('updateColonyInput') updateColonyInput: UpdateColonyInput): Promise<Colony> {
    const colony = await this.coloniesService.update(updateColonyInput.id, updateColonyInput);
    colony && this.pubSub.publish(COLONY_UPDATED_EVENT, { [COLONY_UPDATED_EVENT]: colony });
    return colony;
  }

  @Mutation(() => Colony)
  async removeColony(@Args('id', { type: () => Int }) id: number): Promise<RemoveColonyResult> {
    const colony = await this.coloniesService.findOne(id);
    if (!colony) return { result: false };

    const result = await this.coloniesService.remove(id);
    result && this.pubSub.publish(COLONY_REMOVED_EVENT, { [COLONY_REMOVED_EVENT]: colony });

    return { result };
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => [Colony], { name: 'colonies' })
  find(@Args() filter: FindColoniesArgs): Promise<Colony[]> {
    return this.coloniesService.find(filter);
  }

  @Query(() => Colony, { name: 'colony', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Colony> {
    return this.coloniesService.findOne(id);
  }
  // #endregion Queries
}
