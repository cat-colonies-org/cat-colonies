import { ArgsType, Field, Int } from '@nestjs/graphql';
import { FindArgs } from 'src/common/find.args';

@ArgsType()
export class FindColoniesArgs extends FindArgs {
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

  @Field(() => String, { nullable: true })
  townName?: string;
}
