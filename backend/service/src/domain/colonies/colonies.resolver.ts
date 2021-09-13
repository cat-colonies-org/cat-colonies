import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Colony } from './entities/colony.entity';
import { ColoniesService } from './colonies.service';
import { CreateColonyInput } from './dto/create-colony.input';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { UpdateColonyInput } from './dto/update-colony.input';
import { RemoveColonyResult } from './dto/remove-colony.result';
import { FindColoniesArgs } from './dto/find-colonies.args';
import { FindColoniesResult } from './dto/find-colonies.result';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseResolver } from 'src/common/base-resolver';

@Resolver(() => Colony)
export class ColoniesResolver extends BaseResolver<Colony> {
  constructor(service: ColoniesService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, Colony.name);
  }

  // #region Subscriptions
  @Subscription(() => Colony)
  colonyAdded() {
    return this.addedEvent();
  }

  @Subscription(() => Colony)
  colonyUpdated() {
    return this.updatedEvent();
  }

  @Subscription(() => Colony)
  colonyRemoved() {
    return this.removedEvent();
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => Colony)
  async createColony(@Args('createColonyInput') createColonyInput: CreateColonyInput): Promise<Colony> {
    return this.create(createColonyInput);
  }

  @Mutation(() => Colony)
  async updateColony(@Args('updateColonyInput') updateColonyInput: UpdateColonyInput): Promise<Colony> {
    return this.update(updateColonyInput);
  }

  @Mutation(() => RemoveColonyResult)
  async removeColony(@Args('id', { type: () => Int }) id: number): Promise<RemoveColonyResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindColoniesResult, { name: 'colonies', nullable: true })
  async findColonies(@Args() filter: FindColoniesArgs): Promise<FindColoniesResult> {
    return this.find(filter);
  }

  @Query(() => Colony, { name: 'colony', nullable: true })
  findOneColony(@Args('id', { type: () => Int }) id: number): Promise<Colony> {
    return this.findOne(id);
  }
  // #endregion Queries
}
