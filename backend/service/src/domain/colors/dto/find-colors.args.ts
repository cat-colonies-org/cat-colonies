import { ArgsType, Field, Int } from '@nestjs/graphql';
import { FindArgs } from 'src/common/find.args';

@ArgsType()
export class FindColorsArgs extends FindArgs {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  description?: string;
}
