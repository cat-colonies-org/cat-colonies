import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AddColonyManagerResult {
  @Field(() => Boolean)
  result: boolean;
}
