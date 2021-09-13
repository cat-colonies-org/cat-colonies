import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Town } from '../entities/town.entity';

@ObjectType()
export class FindTownsResult {
  @Field(() => Int)
  total: number;

  @Field(() => [Town])
  items: Town[];
}
