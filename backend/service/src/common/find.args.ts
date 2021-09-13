import { ArgsType, Field, Int } from '@nestjs/graphql';

// TODO: buscar dónde poner esta clase (ahora mismo están el directorio "interfaces", pero no es correcto)

@ArgsType()
export class FindArgs {
  @Field(() => String, { nullable: true })
  order: string;

  @Field(() => Boolean, { nullable: true })
  descending: boolean;

  @Field(() => Int, { nullable: true })
  skip: number;

  @Field(() => Int, { nullable: true })
  take: number;
}
