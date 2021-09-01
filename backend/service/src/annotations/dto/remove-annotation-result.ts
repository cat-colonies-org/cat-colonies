import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveAnnotationResult {
  @Field(() => Boolean)
  result: boolean;
}
