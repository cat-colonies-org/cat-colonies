import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FindTownsArgs {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  name?: string;
}
