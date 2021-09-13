import { CreateColonyInput } from './create-colony.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateColonyInput extends PartialType(CreateColonyInput) {
  @Field(() => Int)
  id: number;
}
