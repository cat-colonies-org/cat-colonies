import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FindEyeColorsArgs {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  description?: string;
}
