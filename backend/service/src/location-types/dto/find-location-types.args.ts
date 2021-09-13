import { ArgsType, Field, Int } from '@nestjs/graphql';
import { FindArgs } from 'src/interfaces/find.args';

@ArgsType()
export class FindLocationTypeArgs extends FindArgs {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  description?: string;
}
