import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { Gender } from '../entities/cat.entity';

@ArgsType()
export class FindCatsArgs {
  @Field(() => Int, { nullable: true })
  birthYear?: number;

  @Field(() => Boolean, { nullable: true })
  sterilized?: boolean;

  @Field(() => Date, { nullable: true })
  sterilizedAt?: Date;

  @Field(() => Int, { nullable: true })
  colonyId?: number;

  @Field(() => Int, { nullable: true })
  colorId?: number;

  @Field(() => Int, { nullable: true })
  patternId?: number;

  @Field(() => Int, { nullable: true })
  eyesId?: number;

  @Field(() => Gender, { nullable: true })
  gender?: Gender;

  @Field(() => Boolean, { nullable: true })
  kitten?: boolean;
}
