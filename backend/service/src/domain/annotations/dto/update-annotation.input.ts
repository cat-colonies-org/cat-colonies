import { CreateAnnotationInput } from './create-annotation.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAnnotationInput extends PartialType(CreateAnnotationInput) {
  @Field(() => Int)
  id: number;
}
