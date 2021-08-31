import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveColorResult {
  @Field(() => Boolean)
  result: boolean;
}
