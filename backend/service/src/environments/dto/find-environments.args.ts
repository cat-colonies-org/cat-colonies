import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FindEnvironmentArgs {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  description?: string;
}
