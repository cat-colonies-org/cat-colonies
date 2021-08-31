import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveColonyResult {
  @Field(() => Boolean)
  result: boolean;
}
