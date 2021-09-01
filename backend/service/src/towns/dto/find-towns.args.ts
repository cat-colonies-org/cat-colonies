import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class FindTownsArgs {
  @Field(() => String, { nullable: true })
  name?: string;
}
