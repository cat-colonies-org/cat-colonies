import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Cat } from './entities/cat.entity';
import { CatsService } from './cats.service';
import { CreateCatInput } from './dto/create-cat.input';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { UpdateCatInput } from './dto/update-cat.input';
import { RemoveCatResult } from './dto/remove-cat.result';
import { FindCatsArgs } from './dto/find-cats.args';
import { FindCatsResult } from './dto/find-cats.result';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseResolver } from 'src/common/base-resolver';

@Resolver(() => Cat)
export class CatsResolver extends BaseResolver<Cat> {
  constructor(service: CatsService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, Cat.name);
  }

  // #region Subscriptions
  @Subscription(() => Cat)
  catAdded() {
    return this.addedEvent();
  }

  @Subscription(() => Cat)
  catUpdated() {
    return this.updatedEvent();
  }

  @Subscription(() => Cat)
  catRemoved() {
    return this.removedEvent();
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => Cat)
  async createCat(@Args('createCatInput') createCatInput: CreateCatInput): Promise<Cat> {
    return this.create(createCatInput);
  }

  @Mutation(() => Cat)
  async updateCat(@Args('updateCatInput') updateCatInput: UpdateCatInput): Promise<Cat> {
    return this.update(updateCatInput);
  }

  @Mutation(() => RemoveCatResult)
  async removeCat(@Args('id', { type: () => Int }) id: number): Promise<RemoveCatResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindCatsResult, { name: 'cats', nullable: true })
  async findCats(@Args() filter: FindCatsArgs): Promise<FindCatsResult> {
    return this.find(filter);
  }

  @Query(() => Cat, { name: 'cat', nullable: true })
  findOneCat(@Args('id', { type: () => Int }) id: number): Promise<Cat> {
    return this.findOne(id);
  }
  // #endregion Queries
}
