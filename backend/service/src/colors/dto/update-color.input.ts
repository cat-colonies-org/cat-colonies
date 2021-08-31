import { CreateColorInput } from './create-color.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateColorInput extends PartialType(CreateColorInput) {
  @Field(() => Int)
  id: number;
}
