import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  surnames: string;

  @Field(() => String)
  idCard: string;

  @Field(() => Int)
  phoneNumber: number;

  @Field(() => String)
  email: string;

  @Field(() => Boolean, { nullable: true })
  authorizesWhatsApp?: boolean;
}