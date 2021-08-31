import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCeaseCauseInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
