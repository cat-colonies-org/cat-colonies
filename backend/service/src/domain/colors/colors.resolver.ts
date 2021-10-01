import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Color } from './entities/color.entity';
import { ColorsService } from './colors.service';
import { CreateColorInput } from './dto/create-color.input';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { UpdateColorInput } from './dto/update-color.input';
import { RemoveColorResult } from './dto/remove-color.result';
import { FindColorsArgs } from './dto/find-colors.args';
import { FindColorsResult } from './dto/find-colors.result';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseResolver } from 'src/common/base-resolver';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { Roles } from '../roles/entities/role.entity';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';

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
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createColor(@Args('createColorInput') createColorInput: CreateColorInput): Promise<Color> {
    return this.create(createColorInput);
  }

  @Mutation(() => Color)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateColor(@Args('updateColorInput') updateColorInput: UpdateColorInput): Promise<Color> {
    return this.update(updateColorInput);
  }

  @Mutation(() => RemoveColorResult)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async removeColor(@Args('id', { type: () => Int }) id: number): Promise<RemoveColorResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindColorsResult, { name: 'colors', nullable: true })
  @UseGuards(GqlAuthGuard)
  async findColors(@Args() filter: FindColorsArgs): Promise<FindColorsResult> {
    return this.find(filter);
  }

  @Query(() => Color, { name: 'color', nullable: true })
  @UseGuards(GqlAuthGuard)
  findOneColor(@Args('id', { type: () => Int }) id: number): Promise<Color> {
    return this.findOne(id);
  }
  // #endregion Queries
}
