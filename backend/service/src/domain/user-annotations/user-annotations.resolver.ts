import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { UserAnnotation } from './entities/user-annotation.entity';
import { UserAnnotationsService } from './user-annotations.service';
import { CreateUserAnnotationInput } from './dto/create-user-annotation.input';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { UpdateUserAnnotationInput } from './dto/update-user-annotation.input';
import { RemoveUserAnnotationResult } from './dto/remove-user-annotation.result';
import { FindUserAnnotationsArgs } from './dto/find-user-annotations.args';
import { FindUserAnnotationsResult } from './dto/find-user-annotations.result';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseResolver } from 'src/common/base-resolver';
import { Roles } from '../roles/entities/role.entity';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';

@Resolver(() => UserAnnotation)
export class UserAnnotationsResolver extends BaseResolver<UserAnnotation> {
  constructor(service: UserAnnotationsService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, UserAnnotation.name);
  }

  // #region Subscriptions
  @Subscription(() => UserAnnotation)
  userAnnotationAdded() {
    return this.addedEvent();
  }

  @Subscription(() => UserAnnotation)
  userAnnotationUpdated() {
    return this.updatedEvent();
  }

  @Subscription(() => UserAnnotation)
  userAnnotationRemoved() {
    return this.removedEvent();
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => UserAnnotation)
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createUserAnnotation(
    @Args('createUserAnnotationInput') createUserAnnotationInput: CreateUserAnnotationInput,
  ): Promise<UserAnnotation> {
    return this.create({ ...createUserAnnotationInput, date: new Date() });
  }

  @Mutation(() => UserAnnotation)
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateUserAnnotation(
    @Args('updateUserAnnotationInput') updateUserAnnotationInput: UpdateUserAnnotationInput,
  ): Promise<UserAnnotation> {
    return this.update(updateUserAnnotationInput);
  }

  @Mutation(() => RemoveUserAnnotationResult)
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async removeUserAnnotation(@Args('id', { type: () => Int }) id: number): Promise<RemoveUserAnnotationResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindUserAnnotationsResult, { name: 'userAnnotations', nullable: true })
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async findUserAnnotations(@Args() filter: FindUserAnnotationsArgs): Promise<FindUserAnnotationsResult> {
    return this.find(filter);
  }

  @Query(() => UserAnnotation, { name: 'userAnnotation', nullable: true })
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  findOneUserAnnotation(@Args('id', { type: () => Int }) id: number): Promise<UserAnnotation> {
    return this.findOne(id);
  }
  // #endregion Queries
}
