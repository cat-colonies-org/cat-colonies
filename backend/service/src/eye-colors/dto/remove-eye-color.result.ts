import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveEyeColorResult {
  @Field(() => Boolean)
  result: boolean;
}
