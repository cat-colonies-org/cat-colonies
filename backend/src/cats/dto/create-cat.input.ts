import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCatInput {
  @Field(() => Int)
  birthYear?: number;

  @Field(() => Boolean)
  sterilized?: boolean;
}
