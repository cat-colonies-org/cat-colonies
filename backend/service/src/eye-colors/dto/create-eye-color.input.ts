import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEyeColorInput {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field(() => String, { nullable: true })
  description: string;
}
