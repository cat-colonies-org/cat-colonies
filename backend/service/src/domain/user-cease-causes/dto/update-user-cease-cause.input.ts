import { CreateUserCeaseCauseInput } from './create-user-cease-cause.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserCeaseCauseInput extends PartialType(CreateUserCeaseCauseInput) {
  @Field(() => Int, { nullable: true })
  id: number;
}
