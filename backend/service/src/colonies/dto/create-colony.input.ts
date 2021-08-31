import { InputType, Int, Field } from '@nestjs/graphql';
import { LocationType } from '../entities/location-type.entity';

@InputType()
export class CreateColonyInput {
  @Field(() => String)
  address: string;

  @Field(() => Int, { nullable: true })
  locationTypeId?: number;

  @Field(() => Int, { nullable: true })
  environmentId?: number;

  @Field(() => Int)
  townId: number;
}
