import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Colony } from 'src/colonies/entities/colony.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Annotation } from './annotation.entity';
import { CeaseCause } from './cease-cause.entity';
import { Coat } from './coat.entity';
import { Eyes } from './eyes.entity';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}
registerEnumType(Gender, { name: 'Gender', description: '' });

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
  ceasedAt?: Date;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  ceaseCauseId?: number;

  @ManyToOne(() => CeaseCause, (ceaseCause) => ceaseCause.cats)
  @Field(() => CeaseCause, { nullable: true })
  ceaseCause?: Promise<CeaseCause>;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  birthYear?: number;

  @Column({ nullable: true })
  @Field(() => Boolean, { nullable: true })
  sterilized?: boolean;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  sterilizedAt?: Date;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  colonyId?: number;

  @ManyToOne(() => Colony, (colony) => colony.cats)
  @Field(() => Colony, { nullable: true })
  colony?: Promise<Colony>;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  coatId?: number;

  @ManyToOne(() => Coat, (coat) => coat.cats)
  @Field(() => Coat, { nullable: true })
  coat?: Promise<Coat>;

  @Column({ nullable: true })
  @Field(() => Gender, { nullable: true })
  gender?: Gender;

  @Column({ nullable: true })
  @Field(() => Boolean, { nullable: true })
  kitten?: boolean;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  eyesId?: number;

  @ManyToOne(() => Eyes, (eyes) => eyes.cats)
  @Field(() => Eyes, { nullable: true })
  eyes?: Promise<Eyes>;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  imageURL?: string;

  @OneToMany(() => Annotation, (annotation) => annotation.cat)
  @Field(() => [Annotation], { nullable: true })
  annotations?: Annotation[];
}
