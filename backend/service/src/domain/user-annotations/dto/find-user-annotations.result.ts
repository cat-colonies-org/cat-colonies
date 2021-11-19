import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserAnnotation } from '../entities/user-annotation.entity';

@ObjectType()
export class FindUserAnnotationsResult {
  @Field(() => Int)
  total: number;

  @Field(() => [UserAnnotation])
  items: UserAnnotation[];
}
