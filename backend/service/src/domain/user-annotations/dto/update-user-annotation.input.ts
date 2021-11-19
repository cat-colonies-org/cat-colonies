import { CreateUserAnnotationInput } from './create-user-annotation.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserAnnotationInput extends PartialType(CreateUserAnnotationInput) {
  @Field(() => Int)
  id: number;
}
