import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Cat } from './entities/cat.entity';
import { CatsService } from './cats.service';
import { CreateCatInput } from './dto/create-cat.input';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { UpdateCatInput } from './dto/update-cat.input';
import { RemoveCatResult } from './dto/remove-cat.result';
import { FindCatsArgs } from './dto/find-cats.args';
import { FindCatsResult } from './dto/find-cats.result';

const CAT_ADDED_EVENT = 'catAdded';
const CAT_UPDATED_EVENT = 'catUpdated';
const CAT_REMOVED_EVENT = 'catRemoved';

@Resolver(() => Cat)
export class CatsResolver {
  constructor(private readonly catsService: CatsService, @Inject(PUB_SUB) private readonly pubSub: RedisPubSub) {}

  // #region Subscriptions
  @Subscription(() => Cat)
  catAdded() {
    return this.pubSub.asyncIterator(CAT_ADDED_EVENT);
  }

  @Subscription(() => Cat)
  catUpdated() {
    return this.pubSub.asyncIterator(CAT_UPDATED_EVENT);
  }

  @Subscription(() => Cat)
  catRemoved() {
    return this.pubSub.asyncIterator(CAT_REMOVED_EVENT);
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => Cat)
  async createCat(@Args('createCatInput') createCatInput: CreateCatInput): Promise<Cat> {
    const cat = await this.catsService.create(createCatInput);
    cat && this.pubSub.publish(CAT_ADDED_EVENT, { [CAT_ADDED_EVENT]: cat });
    return cat;
  }

  @Mutation(() => Cat)
  async updateCat(@Args('updateCatInput') updateCatInput: UpdateCatInput): Promise<Cat> {
    const cat = await this.catsService.update(updateCatInput.id, updateCatInput);
    cat && this.pubSub.publish(CAT_UPDATED_EVENT, { [CAT_UPDATED_EVENT]: cat });
    return cat;
  }

  @Mutation(() => RemoveCatResult)
  async removeCat(@Args('id', { type: () => Int }) id: number): Promise<RemoveCatResult> {
    const cat = await this.catsService.findOne(id);
    if (!cat) return { result: false };

    const result = await this.catsService.remove(id);
    result && this.pubSub.publish(CAT_REMOVED_EVENT, { [CAT_REMOVED_EVENT]: cat });

    return { result };
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindCatsResult, { name: 'cats', nullable: true })
  async find(@Args() filter: FindCatsArgs): Promise<FindCatsResult> {
    const [items, total] = await this.catsService.find(filter);
    return { items, total };
  }

  @Query(() => Cat, { name: 'cat', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Cat> {
    return this.catsService.findOne(id);
  }
  // #endregion Queries
}
