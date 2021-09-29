import { InputType, Int, Field } from '@nestjs/graphql';
import { Gender } from '../entities/cat.entity';

@InputType()
export class CreateCatInput {
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
  eyeColorId?: number;

  @Field(() => Gender, { nullable: true })
  gender?: Gender;

  @Field(() => Boolean, { nullable: true })
  kitten?: boolean;

  @Field(() => Date, { nullable: true })
  ceasedAt?: Date;

  @Field(() => Int, { nullable: true })
  ceaseCauseId?: number;

  @Field(() => Date, { nullable: true })
  bornAt?: Date;
}
