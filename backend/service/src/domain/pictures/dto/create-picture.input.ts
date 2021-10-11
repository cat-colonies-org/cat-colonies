import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreatePictureInput {
  @Field(() => Int)
  catId: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String)
  imageURL: string;

  @Field(() => String)
  thumbnailURL: string;
}
