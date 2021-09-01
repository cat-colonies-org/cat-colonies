import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveUserResult {
  @Field(() => Boolean)
  result: boolean;
}
