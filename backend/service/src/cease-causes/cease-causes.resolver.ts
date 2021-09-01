import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { CeaseCausesService } from './cease-causes.service';
import { CeaseCause } from './entities/cease-cause.entity';
import { CreateCeaseCauseInput } from './dto/create-cease-cause.input';
import { UpdateCeaseCauseInput } from './dto/update-cease-cause.input';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { RemoveCeaseCauseResult } from './dto/remove-cease-cuase-result';
import { FindCeaseCauseArgs } from './dto/find-cease-cause.args';

const CEASE_CAUSE_ADDED_EVENT = 'ceaseCauseAdded';
const CEASE_CAUSE_UPDATED_EVENT = 'ceaseCauseUpdated';
const CEASE_CAUSE_REMOVED_EVENT = 'ceaseCauseRemoved';

@Resolver(() => CeaseCause)
export class CeaseCausesResolver {
  constructor(
    private readonly ceaseCausesService: CeaseCausesService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  // #region Subscriptions
  @Subscription(() => CeaseCause)
  ceaseCauseAdded() {
    return this.pubSub.asyncIterator(CEASE_CAUSE_ADDED_EVENT);
  }

  @Subscription(() => CeaseCause)
  ceaseCauseUpdated() {
    return this.pubSub.asyncIterator(CEASE_CAUSE_UPDATED_EVENT);
  }

  @Subscription(() => CeaseCause)
  ceaseCauseRemoved() {
    return this.pubSub.asyncIterator(CEASE_CAUSE_REMOVED_EVENT);
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => CeaseCause)
  async createCeaseCause(
    @Args('createCeaseCauseInput') createCeaseCauseInput: CreateCeaseCauseInput,
  ): Promise<CeaseCause> {
    const ceaseCause = await this.ceaseCausesService.create(createCeaseCauseInput);
    ceaseCause && this.pubSub.publish(CEASE_CAUSE_ADDED_EVENT, { [CEASE_CAUSE_ADDED_EVENT]: ceaseCause });
    return ceaseCause;
  }

  @Mutation(() => CeaseCause)
  async updateCeaseCause(
    @Args('updateCeaseCauseInput') updateCeaseCauseInput: UpdateCeaseCauseInput,
  ): Promise<CeaseCause> {
    const ceaseCause = await this.ceaseCausesService.update(updateCeaseCauseInput.id, updateCeaseCauseInput);
    ceaseCause && this.pubSub.publish(CEASE_CAUSE_UPDATED_EVENT, { [CEASE_CAUSE_UPDATED_EVENT]: ceaseCause });
    return ceaseCause;
  }

  @Mutation(() => CeaseCause)
  async removeCeaseCause(@Args('id', { type: () => Int }) id: number): Promise<RemoveCeaseCauseResult> {
    const ceaseCause = await this.ceaseCausesService.findOne(id);
    if (!ceaseCause) return { result: false };

    const result = await this.ceaseCausesService.remove(id);
    result && this.pubSub.publish(CEASE_CAUSE_REMOVED_EVENT, { [CEASE_CAUSE_REMOVED_EVENT]: ceaseCause });

    return { result };
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => [CeaseCause], { name: 'ceaseCauses', nullable: true })
  find(@Args() filter: FindCeaseCauseArgs): Promise<CeaseCause[]> {
    return this.ceaseCausesService.find(filter);
  }

  @Query(() => CeaseCause, { name: 'ceaseCause', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<CeaseCause> {
    return this.ceaseCausesService.findOne(id);
  }
  // #endregion Queries
}
