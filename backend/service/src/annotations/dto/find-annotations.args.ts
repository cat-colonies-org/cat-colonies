import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FindAnnotationsArgs {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  catId?: number;

  @Field(() => String, { nullable: true })
  annotation?: string;
}
