import { ArgsType, Field, Int } from '@nestjs/graphql';
import { FindArgs } from 'src/common/find.args';
import { Gender } from '../entities/cat.entity';

@ArgsType()
export class FindCatsArgs extends FindArgs {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Date, { nullable: true })
  bornAt?: Date;

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
}
