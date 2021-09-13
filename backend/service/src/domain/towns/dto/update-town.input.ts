import { CreateTownInput } from './create-town.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTownInput extends PartialType(CreateTownInput) {
  @Field(() => Int)
  id: number;
}
