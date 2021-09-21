import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserCredentials {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
