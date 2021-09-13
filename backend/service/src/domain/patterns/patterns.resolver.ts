import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Pattern } from './entities/pattern.entity';
import { PatternsService } from './patterns.service';
import { CreatePatternInput } from './dto/create-pattern.input';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { UpdatePatternInput } from './dto/update-pattern.input';
import { RemovePatternResult } from './dto/remove-pattern.result';
import { FindPatternsArgs } from './dto/find-patterns.args';
import { FindPatternsResult } from './dto/find-patterns.result';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseResolver } from 'src/common/base-resolver';

@Resolver(() => Pattern)
export class PatternsResolver extends BaseResolver<Pattern> {
  constructor(service: PatternsService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, Pattern.name);
  }

  // #region Subscriptions
  @Subscription(() => Pattern)
  patternAdded() {
    return this.addedEvent();
  }

  @Subscription(() => Pattern)
  patternUpdated() {
    return this.updatedEvent();
  }

  @Subscription(() => Pattern)
  patternRemoved() {
    return this.removedEvent();
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => Pattern)
  async createPattern(@Args('createPatternInput') createPatternInput: CreatePatternInput): Promise<Pattern> {
    return this.create(createPatternInput);
  }

  @Mutation(() => Pattern)
  async updatePattern(@Args('updatePatternInput') updatePatternInput: UpdatePatternInput): Promise<Pattern> {
    return this.update(updatePatternInput);
  }

  @Mutation(() => RemovePatternResult)
  async removePattern(@Args('id', { type: () => Int }) id: number): Promise<RemovePatternResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindPatternsResult, { name: 'patterns', nullable: true })
  async findPatterns(@Args() filter: FindPatternsArgs): Promise<FindPatternsResult> {
    return this.find(filter);
  }

  @Query(() => Pattern, { name: 'pattern', nullable: true })
  findOnePattern(@Args('id', { type: () => Int }) id: number): Promise<Pattern> {
    return this.findOne(id);
  }
  // #endregion Queries
}
