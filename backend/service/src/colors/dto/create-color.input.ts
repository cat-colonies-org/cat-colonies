import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateColorInput {
  @Field(() => String)
  description: string;
}
