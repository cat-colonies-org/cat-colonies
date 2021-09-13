import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { EyeColorsService } from './eye-colors.service';
import { EyeColor } from './entities/eye-color.entity';
import { CreateEyeColorInput } from './dto/create-eye-color.input';
import { UpdateEyeColorInput } from './dto/update-eye-color.input';
import { FindEyeColorsArgs } from './dto/find-eye-colors.args';
import { Inject } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub.module';
import { RemoveEyeColorResult } from './dto/remove-eye-color.result';
import { FindEyeColorsResult } from './dto/find-eye-colors.result';

const EYE_COLOR_ADDED_EVENT = 'eyeColorAdded';
const EYE_COLOR_UPDATED_EVENT = 'eyeColorUpdated';
const EYE_COLOR_REMOVED_EVENT = 'eyeColorRemoved';

@Resolver(() => EyeColor)
export class EyeColorsResolver {
  constructor(
    private readonly eyeColorsService: EyeColorsService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  // #region Subscriptions
  @Subscription(() => EyeColor)
  eyeColorAdded() {
    return this.pubSub.asyncIterator(EYE_COLOR_ADDED_EVENT);
  }

  @Subscription(() => EyeColor)
  eyeColorUpdated() {
    return this.pubSub.asyncIterator(EYE_COLOR_UPDATED_EVENT);
  }

  @Subscription(() => EyeColor)
  eyeColorRemoved() {
    return this.pubSub.asyncIterator(EYE_COLOR_REMOVED_EVENT);
  }

  // #endregion

  // #region Mutations
  @Mutation(() => EyeColor)
  async createEyeColor(@Args('createEyeColorInput') createEyeColorInput: CreateEyeColorInput): Promise<EyeColor> {
    const eyeColor = this.eyeColorsService.create(createEyeColorInput);
    eyeColor && this.pubSub.publish(EYE_COLOR_ADDED_EVENT, { [EYE_COLOR_ADDED_EVENT]: eyeColor });
    return eyeColor;
  }

  @Mutation(() => EyeColor)
  async updateEyeColor(@Args('updateEyeColorInput') updateEyeColorInput: UpdateEyeColorInput): Promise<EyeColor> {
    const eyeColor = this.eyeColorsService.update(updateEyeColorInput.id, updateEyeColorInput);
    eyeColor && this.pubSub.publish(EYE_COLOR_UPDATED_EVENT, { [EYE_COLOR_UPDATED_EVENT]: eyeColor });
    return eyeColor;
  }

  @Mutation(() => EyeColor)
  async removeEyeColor(@Args('id', { type: () => Int }) id: number): Promise<RemoveEyeColorResult> {
    const eyeColor = await this.eyeColorsService.findOne(id);
    if (!eyeColor) return { result: false };

    const result = await this.eyeColorsService.remove(id);
    result && this.pubSub.publish(EYE_COLOR_REMOVED_EVENT, { [EYE_COLOR_REMOVED_EVENT]: eyeColor });

    return { result };
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindEyeColorsResult, { name: 'eyeColors' })
  async find(@Args() filter: FindEyeColorsArgs): Promise<FindEyeColorsResult> {
    const [items, total] = await this.eyeColorsService.find(filter);
    return { items, total };
  }

  @Query(() => EyeColor, { name: 'eyeColor', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<EyeColor> {
    return this.eyeColorsService.findOne(id);
  }
  // #endregion Queries
}