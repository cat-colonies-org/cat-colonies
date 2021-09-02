import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { PatternsService } from './patterns.service';
import { Pattern } from './entities/pattern.entity';
import { CreatePatternInput } from './dto/create-pattern.input';
import { UpdatePatternInput } from './dto/update-pattern.input';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { RemovePatternResult } from './dto/remove-pattern.result';
import { FindPatternArgs } from './dto/find-patterns.args';

const PATTERN_ADDED_EVENT = 'patternAdded';
const PATTERN_UPDATED_EVENT = 'patternUpdated';
const PATTERN_REMOVED_EVENT = 'patternRemoved';

@Resolver(() => Pattern)
export class PatternsResolver {
  constructor(
    private readonly patternsService: PatternsService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  // #region Subscriptions
  @Subscription(() => Pattern)
  patternAdded() {
    return this.pubSub.asyncIterator(PATTERN_ADDED_EVENT);
  }

  @Subscription(() => Pattern)
  patternUpdated() {
    return this.pubSub.asyncIterator(PATTERN_UPDATED_EVENT);
  }

  @Subscription(() => Pattern)
  patternRemoved() {
    return this.pubSub.asyncIterator(PATTERN_REMOVED_EVENT);
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => Pattern)
  async createPattern(@Args('createPatternInput') createPatternInput: CreatePatternInput): Promise<Pattern> {
    const pattern = await this.patternsService.create(createPatternInput);
    pattern && this.pubSub.publish(PATTERN_ADDED_EVENT, { [PATTERN_ADDED_EVENT]: pattern });
    return pattern;
  }

  @Mutation(() => Pattern)
  async updatePattern(@Args('updatePatternInput') updatePatternInput: UpdatePatternInput): Promise<Pattern> {
    const pattern = await this.patternsService.update(updatePatternInput.id, updatePatternInput);
    pattern && this.pubSub.publish(PATTERN_UPDATED_EVENT, { [PATTERN_UPDATED_EVENT]: pattern });
    return pattern;
  }

  @Mutation(() => RemovePatternResult)
  async removePattern(@Args('id', { type: () => Int }) id: number): Promise<RemovePatternResult> {
    const pattern = await this.patternsService.findOne(id);
    if (!pattern) return { result: false };

    const result = await this.patternsService.remove(id);
    result && this.pubSub.publish(PATTERN_REMOVED_EVENT, { [PATTERN_REMOVED_EVENT]: pattern });

    return { result };
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => [Pattern], { name: 'patterns', nullable: true })
  find(@Args() filter: FindPatternArgs): Promise<Pattern[]> {
    return this.patternsService.find(filter);
  }

  @Query(() => Pattern, { name: 'pattern', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Pattern> {
    return this.patternsService.findOne(id);
  }
  // #endregion Queries
}
