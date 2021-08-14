import { CreateCatInput } from './create-cat.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCatInput extends PartialType(CreateCatInput) {
  @Field(() => Int)
  id: number;
}
