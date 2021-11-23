import { ArgsType, Field, Int } from '@nestjs/graphql';
import { FindArgs } from 'src/common/find.args';

@ArgsType()
export class FindUsersArgs extends FindArgs {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  surnames?: string;

  @Field(() => String, { nullable: true })
  idCard?: string;

  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => Boolean, { nullable: true })
  authorizesWhatsApp?: boolean;
}
