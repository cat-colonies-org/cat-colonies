import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveColonyAnnotationResult {
  @Field(() => Boolean)
  result: boolean;
}
