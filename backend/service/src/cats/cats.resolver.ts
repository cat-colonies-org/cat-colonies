import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { Cat } from './entities/cat.entity';
import { CatsService } from './cats.service';
import { Colony } from 'src/colonies/entities/colony.entity';
import { CreateCatInput } from './dto/create-cat.input';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { UpdateCatInput } from './dto/update-cat.input';
import { FindAllCatsArgs } from './dto/find-all-cats.args';

const CAT_ADDED_EVENT = 'catAdded';

@Resolver(() => Cat)
export class CatsResolver {
  constructor(private readonly catsService: CatsService, @Inject(PUB_SUB) private pubSub: RedisPubSub) {}

  @Subscription(() => Cat)
  catAdded() {
    return this.pubSub.asyncIterator(CAT_ADDED_EVENT);
  }

  @Mutation(() => Cat)
  async createCat(@Args('createCatInput') createCatInput: CreateCatInput) {
    const cat = await this.catsService.create(createCatInput);
    this.pubSub.publish(CAT_ADDED_EVENT, { cat });
    return cat;
  }

  @Query(() => [Cat], { name: 'cats', nullable: true })
  findAll(@Args() filter: FindAllCatsArgs): Promise<Cat[]> {
    return this.catsService.findAll(filter);
  }

  @Query(() => Cat, { name: 'cat', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Cat> {
    return this.catsService.findOne(id);
  }

  @Mutation(() => Cat)
  updateCat(@Args('updateCatInput') updateCatInput: UpdateCatInput) {
    return this.catsService.update(updateCatInput.id, updateCatInput);
  }

  @Mutation(() => Cat)
  removeCat(@Args('id', { type: () => Int }) id: number) {
    return this.catsService.remove(id);
  }

  @ResolveField('colony', () => Colony)
  async colony(@Parent() cat: Cat) {
    return await cat.colony;
  }
}
