import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Colony } from 'src/colonies/entities/colony.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Cat extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  birthYear?: number;

  @Column({ nullable: true })
  @Field(() => Boolean, { nullable: true })
  sterilized?: boolean;

  @ManyToOne(() => Colony, (colony) => colony.cats)
  @Field(() => Colony, { nullable: true })
  colony?: Promise<Colony>;
}
