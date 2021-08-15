import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCatInput {
  @Field(() => Int, { nullable: true })
  birthYear?: number;

  @Field(() => Boolean, { nullable: true })
  sterilized?: boolean;

  @Field(() => Int, { nullable: true })
  colonyId?: number;
}
