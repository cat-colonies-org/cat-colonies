import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserCeaseCause } from '../entities/user-cease-cause.entity';

@ObjectType()
export class FindUserCeaseCausesResult {
  @Field(() => Int)
  total: number;

  @Field(() => [UserCeaseCause])
  items: UserCeaseCause[];
}
