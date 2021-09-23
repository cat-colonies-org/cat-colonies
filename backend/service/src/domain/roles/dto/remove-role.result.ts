import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveRoleResult {
  @Field(() => Boolean)
  result: boolean;
}
