import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveEnvironmentResult {
  @Field(() => Boolean)
  result: boolean;
}
