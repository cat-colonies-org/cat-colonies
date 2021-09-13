import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Environment } from '../entities/environment.entity';

@ObjectType()
export class FindEnvironmentsResult {
  @Field(() => Int)
  total: number;

  @Field(() => [Environment])
  items: Environment[];
}
