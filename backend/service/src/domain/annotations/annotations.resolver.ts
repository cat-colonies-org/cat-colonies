import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Annotation } from './entities/annotation.entity';
import { AnnotationsService } from './annotations.service';
import { CreateAnnotationInput } from './dto/create-annotation.input';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { UpdateAnnotationInput } from './dto/update-annotation.input';
import { RemoveAnnotationResult } from './dto/remove-annotation.result';
import { FindAnnotationsArgs } from './dto/find-annotations.args';
import { FindAnnotationsResult } from './dto/find-annotations.result';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseResolver } from 'src/common/base-resolver';

@Resolver(() => Annotation)
export class AnnotationsResolver extends BaseResolver<Annotation> {
  constructor(service: AnnotationsService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, Annotation.name);
  }

  // #region Subscriptions
  @Subscription(() => Annotation)
  annotationAdded() {
    return this.addedEvent();
  }

  @Subscription(() => Annotation)
  annotationUpdated() {
    return this.updatedEvent();
  }

  @Subscription(() => Annotation)
  annotationRemoved() {
    return this.removedEvent();
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => Annotation)
  async createAnnotation(
    @Args('createAnnotationInput') createAnnotationInput: CreateAnnotationInput,
  ): Promise<Annotation> {
    return this.create(createAnnotationInput);
  }

  @Mutation(() => Annotation)
  async updateAnnotation(
    @Args('updateAnnotationInput') updateAnnotationInput: UpdateAnnotationInput,
  ): Promise<Annotation> {
    return this.update(updateAnnotationInput);
  }

  @Mutation(() => RemoveAnnotationResult)
  async removeAnnotation(@Args('id', { type: () => Int }) id: number): Promise<RemoveAnnotationResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindAnnotationsResult, { name: 'annotations', nullable: true })
  async findAnnotations(@Args() filter: FindAnnotationsArgs): Promise<FindAnnotationsResult> {
    return this.find(filter);
  }

  @Query(() => Annotation, { name: 'annotation', nullable: true })
  findOneAnnotation(@Args('id', { type: () => Int }) id: number): Promise<Annotation> {
    return this.findOne(id);
  }
  // #endregion Queries
}
