import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveLocationTypeResult {
  @Field(() => Boolean)
  result: boolean;
}
