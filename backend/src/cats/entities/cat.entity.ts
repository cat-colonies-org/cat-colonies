import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Cat extends BaseEntity {
  @PrimaryGeneratedColumn() // TODO: why the column is not "primary" on postgres database?
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
}
