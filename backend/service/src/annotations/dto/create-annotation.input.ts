import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAnnotationInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
