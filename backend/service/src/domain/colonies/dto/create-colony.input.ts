import { InputType, Int, Field } from '@nestjs/graphql';

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
