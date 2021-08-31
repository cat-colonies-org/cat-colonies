import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Colony } from 'src/colonies/entities/colony.entity';
import { Color } from 'src/colors/entities/color.entity';
import { Pattern } from 'src/patterns/entities/pattern.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Annotation } from './annotation.entity';
import { CeaseCause } from './cease-cause.entity';
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
  colorId?: number;

  @ManyToOne(() => Color, (color) => color.cats)
  @Field(() => Color, { nullable: true })
  color?: Promise<Color>;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  patternId?: number;

  @ManyToOne(() => Pattern, (pattern) => pattern.cats)
  @Field(() => Pattern, { nullable: true })
  pattern?: Promise<Pattern>;

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
