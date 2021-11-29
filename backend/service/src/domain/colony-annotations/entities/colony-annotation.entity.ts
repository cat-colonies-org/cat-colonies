import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Colony } from 'src/domain/colonies/entities/colony.entity';

@Entity()
@ObjectType()
export class ColonyAnnotation extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  annotation: string;

  @Column()
  @Field(() => Date)
  date: Date;

  @Column()
  @Field(() => Int)
  colonyId: number;

  @ManyToOne(() => Colony, (colony) => colony.annotations)
  @Field(() => Colony)
  colony: Promise<Colony>;
}
