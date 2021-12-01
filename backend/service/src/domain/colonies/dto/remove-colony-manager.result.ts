import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveColonyManagerResult {
  @Field(() => Boolean)
  result: boolean;
}
