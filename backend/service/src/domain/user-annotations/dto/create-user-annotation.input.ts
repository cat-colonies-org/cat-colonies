import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserAnnotationInput {
  @Field(() => Int)
  userId: number;

  @Field(() => String)
  annotation: string;
}
