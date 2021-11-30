import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  surnames: string;

  @Field(() => String)
  idCard: string;

  @Field(() => String)
  phoneNumber: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => Boolean, { nullable: true })
  authorizesWhatsApp?: boolean;

  @Field(() => Date, { nullable: true })
  ceasedAt?: Date;

  @Field(() => Int, { nullable: true })
  ceaseCauseId?: number;
}
