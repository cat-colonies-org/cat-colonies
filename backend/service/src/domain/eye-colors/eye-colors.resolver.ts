import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { EyeColorsService } from './eye-colors.service';
import { EyeColor } from './entities/eye-color.entity';
import { CreateEyeColorInput } from './dto/create-eye-color.input';
import { UpdateEyeColorInput } from './dto/update-eye-color.input';
import { FindEyeColorsArgs } from './dto/find-eye-colors.args';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { RemoveEyeColorResult } from './dto/remove-eye-color.result';
import { FindEyeColorsResult } from './dto/find-eye-colors.result';
import { BaseResolver } from 'src/common/base-resolver';
import { PubSubEngine } from 'apollo-server-express';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { Roles } from '../roles/entities/role.entity';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';

@Resolver(() => EyeColor)
export class EyeColorsResolver extends BaseResolver<EyeColor> {
  constructor(service: EyeColorsService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, EyeColor.name);
  }

  // #region Subscriptions
  @Subscription(() => EyeColor)
  eyeColorAdded() {
    return this.addedEvent();
  }

  @Subscription(() => EyeColor)
  eyeColorUpdated() {
    return this.updatedEvent();
  }

  @Subscription(() => EyeColor)
  eyeColorRemoved() {
    return this.removedEvent();
  }

  // #endregion

  // #region Mutations
  @Mutation(() => EyeColor)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createEyeColor(@Args('createEyeColorInput') createEyeColorInput: CreateEyeColorInput): Promise<EyeColor> {
    return this.create(createEyeColorInput);
  }

  @Mutation(() => EyeColor)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateEyeColor(@Args('updateEyeColorInput') updateEyeColorInput: UpdateEyeColorInput): Promise<EyeColor> {
    return this.update(updateEyeColorInput);
  }

  @Mutation(() => EyeColor)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async removeEyeColor(@Args('id', { type: () => Int }) id: number): Promise<RemoveEyeColorResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindEyeColorsResult, { name: 'eyeColors' })
  @UseGuards(GqlAuthGuard)
  async findEyeColors(@Args() filter: FindEyeColorsArgs): Promise<FindEyeColorsResult> {
    return this.find(filter);
  }

  @Query(() => EyeColor, { name: 'eyeColor', nullable: true })
  @UseGuards(GqlAuthGuard)
  findOneEyeColor(@Args('id', { type: () => Int }) id: number): Promise<EyeColor> {
    return this.findOne(id);
  }
  // #endregion Queries
}
