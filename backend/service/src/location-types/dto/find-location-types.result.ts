import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LocationType } from '../entities/location-type.entity';

@ObjectType()
export class FindLocationTypesResult {
  @Field(() => Int)
  total: number;

  @Field(() => [LocationType])
  items: LocationType[];
}
