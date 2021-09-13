import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemovePatternResult {
  @Field(() => Boolean)
  result: boolean;
}
