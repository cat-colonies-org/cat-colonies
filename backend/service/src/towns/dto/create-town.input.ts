import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTownInput {
  @Field(() => String)
  name: string;
}
