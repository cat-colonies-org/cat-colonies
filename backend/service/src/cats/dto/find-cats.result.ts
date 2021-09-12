import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Cat } from '../entities/cat.entity';

@ObjectType()
// TODO: extend from FindResult
export class FindCatsResult {
  @Field(() => Int)
  total: number;

  @Field(() => [Cat])
  data: Cat[];
}
