import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTownInput {
  @Field(() => String)
  name: string;
}
