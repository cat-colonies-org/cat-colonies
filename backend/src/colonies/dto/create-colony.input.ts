import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateColonyInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
