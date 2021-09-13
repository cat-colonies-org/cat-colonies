import { CreatePatternInput } from './create-pattern.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePatternInput extends PartialType(CreatePatternInput) {
  @Field(() => Int)
  id: number;
}
