import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateLocationTypeInput {
  @Field(() => String)
  description: string;
}
