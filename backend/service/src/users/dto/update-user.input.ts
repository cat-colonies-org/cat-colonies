import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id: number;

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
