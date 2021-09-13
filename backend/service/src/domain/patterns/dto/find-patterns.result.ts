import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Pattern } from '../entities/pattern.entity';

@ObjectType()
export class FindPatternsResult {
  @Field(() => Int)
  total: number;

  @Field(() => [Pattern])
  items: Pattern[];
}
