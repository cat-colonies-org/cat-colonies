import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { TownsService } from './towns.service';
import { Town } from './entities/town.entity';
import { CreateTownInput } from './dto/create-town.input';
import { UpdateTownInput } from './dto/update-town.input';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub.module';
import { Inject } from '@nestjs/common';
import { RemoveTownResult } from './dto/remove-town.result';
import { FindTownsArgs } from './dto/find-towns.args';

const TOWN_ADDED_EVENT = 'townAdded';
const TOWN_UPDATED_EVENT = 'townUpdated';
const TOWN_REMOVED_EVENT = 'townRemoved';

@Resolver(() => Town)
export class TownsResolver {
  constructor(private readonly townsService: TownsService, @Inject(PUB_SUB) private readonly pubSub: RedisPubSub) {}

  // #region Subscriptions
  @Subscription(() => Town)
  townAdded() {
    return this.pubSub.asyncIterator(TOWN_ADDED_EVENT);
  }

  @Subscription(() => Town)
  townUpdated() {
    return this.pubSub.asyncIterator(TOWN_UPDATED_EVENT);
  }

  @Subscription(() => Town)
  townRemoved() {
    return this.pubSub.asyncIterator(TOWN_REMOVED_EVENT);
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => Town)
  async createTown(@Args('createTownInput') createTownInput: CreateTownInput): Promise<Town> {
    const town = await this.townsService.create(createTownInput);
    town && this.pubSub.publish(TOWN_ADDED_EVENT, { [TOWN_ADDED_EVENT]: town });
    return town;
  }

  @Mutation(() => Town)
  async updateTown(@Args('updateTownInput') updateTownInput: UpdateTownInput): Promise<Town> {
    const cat = await this.townsService.update(updateTownInput.id, updateTownInput);
    cat && this.pubSub.publish(TOWN_UPDATED_EVENT, { [TOWN_UPDATED_EVENT]: cat });
    return cat;
  }

  @Mutation(() => Town)
  async removeTown(@Args('id', { type: () => Int }) id: number): Promise<RemoveTownResult> {
    const town = await this.townsService.findOne(id);
    if (!town) return { result: false };

    const result = await this.townsService.remove(id);
    result && this.pubSub.publish(TOWN_REMOVED_EVENT, { [TOWN_REMOVED_EVENT]: town });

    return { result };
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => [Town], { name: 'towns', nullable: true })
  find(@Args() filter: FindTownsArgs): Promise<Town[]> {
    return this.townsService.find(filter);
  }

  @Query(() => Town, { name: 'town', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Town> {
    return this.townsService.findOne(id);
  }
  // #endregion Queries
}
