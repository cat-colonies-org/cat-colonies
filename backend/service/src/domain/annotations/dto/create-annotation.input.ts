import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAnnotationInput {
  @Field(() => Int)
  catId: number;

  @Field(() => String)
  annotation: string;
}
