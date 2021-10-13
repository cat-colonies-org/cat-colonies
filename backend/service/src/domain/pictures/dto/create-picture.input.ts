import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreatePictureInput {
  @Field(() => Int)
  catId: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String)
  originalFilename: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  thumbnail: string;
}
