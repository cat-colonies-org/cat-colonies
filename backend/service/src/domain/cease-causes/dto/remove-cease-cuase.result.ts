import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveCeaseCauseResult {
  @Field(() => Boolean)
  result: boolean;
}
