import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveUserAnnotationResult {
  @Field(() => Boolean)
  result: boolean;
}
