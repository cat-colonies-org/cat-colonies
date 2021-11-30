import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserCeaseCauseInput {
  @Field(() => String)
  description: string;
}
