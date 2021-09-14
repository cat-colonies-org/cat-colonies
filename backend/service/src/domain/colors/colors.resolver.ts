import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Color } from './entities/color.entity';
import { ColorsService } from './colors.service';
import { CreateColorInput } from './dto/create-color.input';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { UpdateColorInput } from './dto/update-color.input';
import { RemoveColorResult } from './dto/remove-color.result';
import { FindColorsArgs } from './dto/find-colors.args';
import { FindColorsResult } from './dto/find-colors.result';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseResolver } from 'src/common/base-resolver';

@Resolver(() => Color)
export class ColorsResolver extends BaseResolver<Color> {
  constructor(service: ColorsService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, Color.name);
  }

  // #region Subscriptions
  @Subscription(() => Color)
  colorAdded() {
    return this.addedEvent();
  }

  @Subscription(() => Color)
  colorUpdated() {
    return this.updatedEvent();
  }

  @Subscription(() => Color)
  colorRemoved() {
    return this.removedEvent();
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => Color)
  async createColor(@Args('createColorInput') createColorInput: CreateColorInput): Promise<Color> {
    return this.create(createColorInput);
  }

  @Mutation(() => Color)
  async updateColor(@Args('updateColorInput') updateColorInput: UpdateColorInput): Promise<Color> {
    return this.update(updateColorInput);
  }

  @Mutation(() => RemoveColorResult)
  async removeColor(@Args('id', { type: () => Int }) id: number): Promise<RemoveColorResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindColorsResult, { name: 'colors', nullable: true })
  async findColors(@Args() filter: FindColorsArgs): Promise<FindColorsResult> {
    return this.find(filter);
  }

  @Query(() => Color, { name: 'color', nullable: true })
  findOneColor(@Args('id', { type: () => Int }) id: number): Promise<Color> {
    return this.findOne(id);
  }
  // #endregion Queries
}
