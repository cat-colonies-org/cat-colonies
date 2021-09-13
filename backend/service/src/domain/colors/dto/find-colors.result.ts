import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Color } from '../entities/color.entity';

@ObjectType()
export class FindColorsResult {
  @Field(() => Int)
  total: number;

  @Field(() => [Color])
  items: Color[];
}
