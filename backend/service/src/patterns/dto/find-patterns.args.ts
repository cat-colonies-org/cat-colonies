import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class FindPatternArgs {
  @Field(() => String, { nullable: true })
  description?: string;
}
