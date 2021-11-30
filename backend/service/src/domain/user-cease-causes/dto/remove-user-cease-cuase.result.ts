import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveUserCeaseCauseResult {
  @Field(() => Boolean)
  result: boolean;
}
