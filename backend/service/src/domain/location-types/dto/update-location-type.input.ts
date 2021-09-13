import { CreateLocationTypeInput } from './create-location-type.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLocationTypeInput extends PartialType(CreateLocationTypeInput) {
  @Field(() => Int)
  id: number;
}
