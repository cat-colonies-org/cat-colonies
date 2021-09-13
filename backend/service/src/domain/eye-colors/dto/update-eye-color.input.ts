import { CreateEyeColorInput } from './create-eye-color.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEyeColorInput extends PartialType(CreateEyeColorInput) {
  @Field(() => Int)
  id: number;
}
