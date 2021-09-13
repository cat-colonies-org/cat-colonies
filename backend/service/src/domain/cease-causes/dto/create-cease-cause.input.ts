import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCeaseCauseInput {
  @Field(() => String)
  description: string;
}
