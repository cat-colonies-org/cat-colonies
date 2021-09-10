import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FindArgs {
  @Field(() => String, { nullable: true })
  order: string;

  @Field(() => Boolean, { nullable: true })
  descending: boolean;

  @Field(() => Int, { nullable: true })
  skip: number;

  @Field(() => Int, { nullable: true })
  take: number;
}
