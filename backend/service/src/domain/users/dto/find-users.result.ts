import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class FindUsersResult {
  @Field(() => Int)
  total: number;

  @Field(() => [User])
  items: User[];
}
