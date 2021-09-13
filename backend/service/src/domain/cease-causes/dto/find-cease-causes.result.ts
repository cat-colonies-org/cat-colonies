import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CeaseCause } from '../entities/cease-cause.entity';

@ObjectType()
export class FindCeaseCausesResult {
  @Field(() => Int)
  total: number;

  @Field(() => [CeaseCause])
  items: CeaseCause[];
}
