import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateDocumentInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String)
  originalFilename: string;

  @Field(() => String)
  document: string;
}
