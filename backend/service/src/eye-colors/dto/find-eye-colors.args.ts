import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class FindEyeColorsArgs {
  @Field(() => String, { nullable: true })
  description?: string;
}
