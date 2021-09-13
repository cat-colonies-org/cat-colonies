import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePatternInput {
  @Field(() => String)
  description: string;
}
