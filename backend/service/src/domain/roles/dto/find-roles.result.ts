import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Role } from '../entities/role.entity';

@ObjectType()
export class FindRolesResult {
  @Field(() => Int)
  total: number;

  @Field(() => [Role])
  items: Role[];
}
