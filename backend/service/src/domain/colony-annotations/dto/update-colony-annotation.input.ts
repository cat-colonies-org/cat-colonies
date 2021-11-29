import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateColonyAnnotationInput } from './create-colony-annotation.input';

@InputType()
export class UpdateColonyAnnotationInput extends PartialType(CreateColonyAnnotationInput) {
  @Field(() => Int)
  id: number;
}
