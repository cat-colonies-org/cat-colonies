import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTownInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
