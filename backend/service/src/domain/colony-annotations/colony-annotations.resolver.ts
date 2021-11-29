import { BaseResolver } from 'src/common/base-resolver';
import { ColonyAnnotation } from './entities/colony-annotation.entity';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { PubSubEngine } from 'graphql-subscriptions';
import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Roles } from '../roles/entities/role.entity';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { ColonyAnnotationsService } from './colony-annotations.service';
import { CreateColonyAnnotationInput } from './dto/create-colony-annotation.input';
import { UpdateColonyAnnotationInput } from './dto/update-colony-annotation.input';
import { RemoveColonyAnnotationResult } from './dto/remove-colony-annotation.result';
import { FindColonyAnnotationsResult } from './dto/find-colony-annotations.result';
import { FindColonyAnnotationsArgs } from './dto/find-colony-annotations.args';

@Resolver(() => ColonyAnnotation)
export class ColonyAnnotationsResolver extends BaseResolver<ColonyAnnotation> {
  constructor(service: ColonyAnnotationsService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, ColonyAnnotation.name);
  }

  // #region Subscriptions
  @Subscription(() => ColonyAnnotation)
  colonyAnnotationAdded() {
    return this.addedEvent();
  }

  @Subscription(() => ColonyAnnotation)
  colonyAnnotationUpdated() {
    return this.updatedEvent();
  }

  @Subscription(() => ColonyAnnotation)
  colonyAnnotationRemoved() {
    return this.removedEvent();
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => ColonyAnnotation)
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createColonyAnnotation(
    @Args('createColonyAnnotationInput') createColonyAnnotationInput: CreateColonyAnnotationInput,
  ): Promise<ColonyAnnotation> {
    return this.create({ ...createColonyAnnotationInput, date: new Date() });
  }

  @Mutation(() => ColonyAnnotation)
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateColonyAnnotation(
    @Args('updateColonyAnnotationInput') updateColonyAnnotationInput: UpdateColonyAnnotationInput,
  ): Promise<ColonyAnnotation> {
    return this.update(updateColonyAnnotationInput);
  }

  @Mutation(() => RemoveColonyAnnotationResult)
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async removeColonyAnnotation(@Args('id', { type: () => Int }) id: number): Promise<RemoveColonyAnnotationResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindColonyAnnotationsResult, { name: 'colonyAnnotations', nullable: true })
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async findColonyAnnotations(@Args() filter: FindColonyAnnotationsArgs): Promise<FindColonyAnnotationsResult> {
    return this.find(filter);
  }

  @Query(() => ColonyAnnotation, { name: 'colonyAnnotation', nullable: true })
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  findOneColonyAnnotation(@Args('id', { type: () => Int }) id: number): Promise<ColonyAnnotation> {
    return this.findOne(id);
  }
  // #endregion Queries
}
