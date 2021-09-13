import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveTownResult {
  @Field(() => Boolean)
  result: boolean;
}
