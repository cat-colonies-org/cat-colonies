import { ArgsType, Field, Int } from '@nestjs/graphql';
import { FindArgs } from 'src/interfaces/find.args';

@ArgsType()
export class FindAnnotationsArgs extends FindArgs {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  catId?: number;

  @Field(() => String, { nullable: true })
  annotation?: string;
}
