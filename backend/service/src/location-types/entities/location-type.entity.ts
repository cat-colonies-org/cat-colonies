import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Colony } from 'src/colonies/entities/colony.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class LocationType extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  description: string;

  @OneToMany(() => Colony, (colony) => colony.locationType)
  @Field(() => [Colony], { nullable: true })
  colonies?: Promise<Colony[]>;
}
