import { InputType, Int, Field } from '@nestjs/graphql';
import { Gender } from '../entities/cat.entity';

@InputType()
export class InputColor {
  @Field(() => Int)
  id?: number;

  @Field(() => String)
  description: string;
}

@InputType()
export class InputAnnotation {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  catId: number;

  @Field(() => String)
  annotation: string;

  @Field(() => Date)
  date: Date;
}

@InputType()
export class CreateCatInput {
  @Field(() => Boolean, { nullable: true })
  sterilized?: boolean;

  @Field(() => Date, { nullable: true })
  sterilizedAt?: Date;

  @Field(() => Int, { nullable: true })
  colonyId?: number;

  @Field(() => Int, { nullable: true })
  patternId?: number;

  @Field(() => [InputColor], { nullable: true })
  colors?: InputColor[];

  @Field(() => Int, { nullable: true })
  eyeColorId?: number;

  @Field(() => Gender, { nullable: true })
  gender?: Gender;

  @Field(() => Date, { nullable: true })
  ceasedAt?: Date;

  @Field(() => Int, { nullable: true })
  ceaseCauseId?: number;

  @Field(() => Date, { nullable: true })
  bornAt?: Date;

  @Field(() => [InputAnnotation], { nullable: true })
  annotations?: InputAnnotation[];
}
