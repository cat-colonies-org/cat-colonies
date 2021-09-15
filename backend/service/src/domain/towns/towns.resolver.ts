import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Town } from './entities/town.entity';
import { TownsService } from './towns.service';
import { CreateTownInput } from './dto/create-town.input';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { UpdateTownInput } from './dto/update-town.input';
import { RemoveTownResult } from './dto/remove-town.result';
import { FindTownsArgs } from './dto/find-towns.args';
import { FindTownsResult } from './dto/find-towns.result';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseResolver } from 'src/common/base-resolver';

@Resolver(() => Town)
export class TownsResolver extends BaseResolver<Town> {
  constructor(service: TownsService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, Town.name);
  }

  // #region Subscriptions
  @Subscription(() => Town)
  townAdded() {
    return this.addedEvent();
  }

  @Subscription(() => Town)
  townUpdated() {
    return this.updatedEvent();
  }

  @Subscription(() => Town)
  townRemoved() {
    return this.removedEvent();
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => Town)
  async createTown(@Args('createTownInput') createTownInput: CreateTownInput): Promise<Town> {
    return this.create(createTownInput);
  }

  @Mutation(() => Town)
  async updateTown(@Args('updateTownInput') updateTownInput: UpdateTownInput): Promise<Town> {
    return this.update(updateTownInput);
  }

  @Mutation(() => RemoveTownResult)
  async removeTown(@Args('id', { type: () => Int }) id: number): Promise<RemoveTownResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindTownsResult, { name: 'towns', nullable: true })
  async findTowns(@Args() filter: FindTownsArgs): Promise<FindTownsResult> {
    return this.find(filter);
  }

  @Query(() => Town, { name: 'town', nullable: true })
  findOneTown(@Args('id', { type: () => Int }) id: number): Promise<Town> {
    return this.findOne(id);
  }
  // #endregion Queries
}
