import { Annotation } from './entities/annotation.entity';
import { AnnotationsService } from './annotations.service';
import { CreateAnnotationInput } from './dto/create-annotation.input';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { UpdateAnnotationInput } from './dto/update-annotation.input';
import { RemoveAnnotationResult } from './dto/remove-annotation.result';
import { FindAnnotationsArgs } from './dto/find-annotations.args';
import { FindAnnotationsResult } from './dto/find-annotations.result';

const ANNOTATION_ADDED_EVENT = 'annotationAdded';
const ANNOTATION_UPDATED_EVENT = 'annotationUpdated';
const ANNOTATION_REMOVED_EVENT = 'annotationRemoved';

@Resolver(() => Annotation)
export class AnnotationsResolver {
  constructor(
    private readonly annotationsService: AnnotationsService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  // #region Subscriptions
  @Subscription(() => Annotation)
  annotationAdded() {
    return this.pubSub.asyncIterator(ANNOTATION_ADDED_EVENT);
  }

  @Subscription(() => Annotation)
  annotationUpdated() {
    return this.pubSub.asyncIterator(ANNOTATION_UPDATED_EVENT);
  }

  @Subscription(() => Annotation)
  annotationRemoved() {
    return this.pubSub.asyncIterator(ANNOTATION_REMOVED_EVENT);
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => Annotation)
  async createAnnotation(
    @Args('createAnnotationInput') createAnnotationInput: CreateAnnotationInput,
  ): Promise<Annotation> {
    const annotation = await this.annotationsService.create(createAnnotationInput);
    annotation && this.pubSub.publish(ANNOTATION_ADDED_EVENT, { [ANNOTATION_ADDED_EVENT]: annotation });
    return annotation;
  }

  @Mutation(() => Annotation)
  async updateAnnotation(
    @Args('updateAnnotationInput') updateAnnotationInput: UpdateAnnotationInput,
  ): Promise<Annotation> {
    const annotation = await this.annotationsService.update(updateAnnotationInput.id, updateAnnotationInput);
    annotation && this.pubSub.publish(ANNOTATION_UPDATED_EVENT, { [ANNOTATION_UPDATED_EVENT]: annotation });
    return annotation;
  }

  @Mutation(() => Annotation)
  async removeAnnotation(@Args('id', { type: () => Int }) id: number): Promise<RemoveAnnotationResult> {
    const annotation = await this.annotationsService.findOne(id);
    if (!annotation) return { result: false };

    const result = await this.annotationsService.remove(id);
    result && this.pubSub.publish(ANNOTATION_REMOVED_EVENT, { [ANNOTATION_REMOVED_EVENT]: annotation });

    return { result };
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindAnnotationsResult, { name: 'annotations', nullable: true })
  async find(@Args() filter: FindAnnotationsArgs): Promise<FindAnnotationsResult> {
    const [items, total] = await this.annotationsService.find(filter);
    return { items, total };
  }

  @Query(() => Annotation, { name: 'annotation', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Annotation> {
    return this.annotationsService.findOne(id);
  }
  // #endregion Queries
}
