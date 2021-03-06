import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { CeaseCause } from './entities/cease-cause.entity';
import { CeaseCausesService } from './cease-causes.service';
import { CreateCeaseCauseInput } from './dto/create-cease-cause.input';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { UpdateCeaseCauseInput } from './dto/update-cease-cause.input';
import { RemoveCeaseCauseResult } from './dto/remove-cease-cuase.result';
import { FindCeaseCauseArgs } from './dto/find-cease-causes.args';
import { FindCeaseCausesResult } from './dto/find-cease-causes.result';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseResolver } from 'src/common/base-resolver';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { Roles } from '../roles/entities/role.entity';

@Resolver(() => CeaseCause)
export class CeaseCausesResolver extends BaseResolver<CeaseCause> {
  constructor(service: CeaseCausesService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, CeaseCause.name);
  }

  // #region Subscriptions
  @Subscription(() => CeaseCause)
  ceaseCauseAdded() {
    return this.addedEvent();
  }

  @Subscription(() => CeaseCause)
  ceaseCauseUpdated() {
    return this.updatedEvent();
  }

  @Subscription(() => CeaseCause)
  ceaseCauseRemoved() {
    return this.removedEvent();
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => CeaseCause)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createCeaseCause(
    @Args('createCeaseCauseInput') createCeaseCauseInput: CreateCeaseCauseInput,
  ): Promise<CeaseCause> {
    return this.create(createCeaseCauseInput);
  }

  @Mutation(() => CeaseCause)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateCeaseCause(
    @Args('updateCeaseCauseInput') updateCeaseCauseInput: UpdateCeaseCauseInput,
  ): Promise<CeaseCause> {
    return this.update(updateCeaseCauseInput);
  }

  @Mutation(() => RemoveCeaseCauseResult)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async removeCeaseCause(@Args('id', { type: () => Int }) id: number): Promise<RemoveCeaseCauseResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindCeaseCausesResult, { name: 'ceaseCauses', nullable: true })
  @UseGuards(GqlAuthGuard)
  async findCeaseCauses(@Args() filter: FindCeaseCauseArgs): Promise<FindCeaseCausesResult> {
    return this.find(filter);
  }

  @Query(() => CeaseCause, { name: 'ceaseCause', nullable: true })
  @UseGuards(GqlAuthGuard)
  findOneCeaseCause(@Args('id', { type: () => Int }) id: number): Promise<CeaseCause> {
    return this.findOne(id);
  }
  // #endregion Queries
}
