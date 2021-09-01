import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FindColoniesArgs {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => Int, { nullable: true })
  locationTypeId?: number;

  @Field(() => Int, { nullable: true })
  environmentId?: number;

  @Field(() => Int, { nullable: true })
  townId?: number;
}