import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Cat } from '../entities/cat.entity';

@ObjectType()
export class FindCatsResult {
  @Field(() => Int)
  total: number;

  @Field(() => [Cat])
  items: Cat[];
}
