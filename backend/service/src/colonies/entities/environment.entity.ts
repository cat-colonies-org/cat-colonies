import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Colony } from './colony.entity';

@Entity()
@ObjectType()
export class Environment extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  description: string;

  @OneToMany(() => Colony, (colony) => colony.environment)
  @Field(() => [Colony])
  colonies: Promise<Colony[]>;
}