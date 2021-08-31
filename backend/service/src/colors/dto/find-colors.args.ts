import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class FindColorsArgs {
  @Field(() => String, { nullable: true })
  description?: string;
}
