import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEyeColorInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
