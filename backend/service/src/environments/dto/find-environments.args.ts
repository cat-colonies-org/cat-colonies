import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Colony } from 'src/colonies/entities/colony.entity';

@ArgsType()
export class FindEnvironmentArgs {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  description?: string;
}
