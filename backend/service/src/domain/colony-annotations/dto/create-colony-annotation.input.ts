import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateColonyAnnotationInput {
  @Field(() => Int)
  colonyId: number;

  @Field(() => String)
  annotation: string;
}
