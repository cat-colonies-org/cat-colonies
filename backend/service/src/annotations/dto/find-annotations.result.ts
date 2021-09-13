import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Annotation } from '../entities/annotation.entity';

@ObjectType()
export class FindAnnotationsResult {
  @Field(() => Int)
  total: number;

  @Field(() => [Annotation])
  items: Annotation[];
}
