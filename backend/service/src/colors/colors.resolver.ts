import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Color } from '../colors/entities/color.entity';
import { CreateColorInput } from './dto/create-color.input';
import { UpdateColorInput } from './dto/update-color.input';
import { ColorsService } from './colors.service';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { RemoveColorResult } from './dto/remove-color-result';
import { FindColorsArgs } from './dto/find-colors.args';

const COLOR_ADDED_EVENT = 'colorAdded';
const COLOR_UPDATED_EVENT = 'colorUpdated';
const COLOR_REMOVED_EVENT = 'colorRemoved';

@Resolver(() => Color)
export class ColorsResolver {
  constructor(private readonly colorsService: ColorsService, @Inject(PUB_SUB) private readonly pubSub: RedisPubSub) {}

  // #region Subscriptions
  @Subscription(() => Color)
  colorAdded() {
    return this.pubSub.asyncIterator(COLOR_ADDED_EVENT);
  }

  @Subscription(() => Color)
  colorUpdated() {
    return this.pubSub.asyncIterator(COLOR_UPDATED_EVENT);
  }

  @Subscription(() => Color)
  colorRemoved() {
    return this.pubSub.asyncIterator(COLOR_REMOVED_EVENT);
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => Color)
  async createColor(@Args('createColorInput') createColorInput: CreateColorInput): Promise<Color> {
    const color = await this.colorsService.create(createColorInput);
    color && this.pubSub.publish(COLOR_ADDED_EVENT, { [COLOR_ADDED_EVENT]: color });
    return color;
  }

  @Mutation(() => Color)
  async updateColor(@Args('updateColorInput') updateColorInput: UpdateColorInput): Promise<Color> {
    const color = await this.colorsService.update(updateColorInput.id, updateColorInput);
    color && this.pubSub.publish(COLOR_UPDATED_EVENT, { [COLOR_UPDATED_EVENT]: color });
    return color;
  }

  @Mutation(() => RemoveColorResult)
  async removeColor(@Args('id', { type: () => Int }) id: number): Promise<RemoveColorResult> {
    const color = await this.colorsService.findOne(id);
    if (!color) return { result: false };

    const result = await this.colorsService.remove(id);
    result && this.pubSub.publish(COLOR_REMOVED_EVENT, { [COLOR_REMOVED_EVENT]: color });

    return { result };
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => [Color], { name: 'colors', nullable: true })
  find(@Args() filter: FindColorsArgs): Promise<Color[]> {
    return this.colorsService.find(filter);
  }

  @Query(() => Color, { name: 'color', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Color> {
    return this.colorsService.findOne(id);
  }
  // #endregion Queries
}
