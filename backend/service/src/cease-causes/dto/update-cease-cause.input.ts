import { CreateCeaseCauseInput } from './create-cease-cause.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCeaseCauseInput extends PartialType(CreateCeaseCauseInput) {
  @Field(() => Int, { nullable: true })
  id: number;
}
