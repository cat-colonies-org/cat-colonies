import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FindCatsArgs {
  @Field(() => Int, { nullable: true })
  birthYear?: number;

  @Field(() => Boolean, { nullable: true })
  sterilized?: boolean;

  @Field(() => Int, { nullable: true })
  colonyId?: number;
}
