import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEnvironmentInput {
  @Field(() => String)
  description: string;
}
