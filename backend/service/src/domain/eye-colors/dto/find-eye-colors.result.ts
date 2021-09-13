import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EyeColor } from '../entities/eye-color.entity';

@ObjectType()
export class FindEyeColorsResult {
  @Field(() => Int)
  total: number;

  @Field(() => [EyeColor])
  items: EyeColor[];
}
