import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ColonyAnnotation } from '../entities/colony-annotation.entity';

@ObjectType()
export class FindColonyAnnotationsResult {
  @Field(() => Int)
  total: number;

  @Field(() => [ColonyAnnotation])
  items: ColonyAnnotation[];
}
