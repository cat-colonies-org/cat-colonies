import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FindAllUsersArgs {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  surnames?: string;

  @Field(() => String, { nullable: true })
  idCard?: string;

  @Field(() => Int, { nullable: true })
  phoneNumber?: number;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => Boolean, { nullable: true })
  authorizesWhatsApp?: boolean;
}
