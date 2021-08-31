import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveCatResult {
  @Field(() => Boolean)
  result: boolean;
}
