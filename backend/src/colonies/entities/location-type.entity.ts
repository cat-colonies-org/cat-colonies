import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Colony } from './colony.entity';

@Entity()
@ObjectType()
export class LocationType {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  description: string;

  @OneToMany(() => Colony, (colony) => colony.locationType)
  colonies: Colony[];
}
