import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Annotation } from './entities/annotation.entity';
import { AnnotationsService } from './annotations.service';
import { CreateAnnotationInput } from './dto/create-annotation.input';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { UpdateAnnotationInput } from './dto/update-annotation.input';
import { RemoveAnnotationResult } from './dto/remove-annotation.result';
import { FindAnnotationsArgs } from './dto/find-annotations.args';
import { FindAnnotationsResult } from './dto/find-annotations.result';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseResolver } from 'src/common/base-resolver';
import { Roles } from '../roles/entities/role.entity';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';

@Resolver(() => Annotation)
export class AnnotationsResolver extends BaseResolver<Annotation> {
  constructor(service: AnnotationsService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, Annotation.name);
  }

  // #region Mutations
  @Mutation(() => Annotation)
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createAnnotation(
    @Args('createAnnotationInput') createAnnotationInput: CreateAnnotationInput,
  ): Promise<Annotation> {
    return this.create({ ...createAnnotationInput, date: new Date() });
  }

  @Mutation(() => Annotation)
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateAnnotation(
    @Args('updateAnnotationInput') updateAnnotationInput: UpdateAnnotationInput,
  ): Promise<Annotation> {
    return this.update(updateAnnotationInput);
  }

  @Mutation(() => RemoveAnnotationResult)
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async removeAnnotation(@Args('id', { type: () => Int }) id: number): Promise<RemoveAnnotationResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindAnnotationsResult, { name: 'annotations', nullable: true })
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async findAnnotations(@Args() filter: FindAnnotationsArgs): Promise<FindAnnotationsResult> {
    return this.find(filter);
  }

  @Query(() => Annotation, { name: 'annotation', nullable: true })
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  findOneAnnotation(@Args('id', { type: () => Int }) id: number): Promise<Annotation> {
    return this.findOne(id);
  }
  // #endregion Queries
}
