import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Colony } from '../entities/colony.entity';

@ObjectType()
export class FindColoniesResult {
  @Field(() => Int)
  total: number;

  @Field(() => [Colony])
  items: Colony[];
}
