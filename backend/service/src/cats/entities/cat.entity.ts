import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Annotation } from 'src/annotations/entities/annotation.entity';
import { CeaseCause } from 'src/cease-causes/entities/cease-cause.entity';
import { Colony } from 'src/colonies/entities/colony.entity';
import { Color } from 'src/colors/entities/color.entity';
import { EyeColor } from 'src/eye-colors/entities/eye-color.entity';
import { Pattern } from 'src/patterns/entities/pattern.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  eyeColorId?: number;

  @ManyToOne(() => EyeColor, (eyeColors) => eyeColors.cats)
  @Field(() => EyeColor, { nullable: true })
  eyeColor?: Promise<EyeColor>;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  imageURL?: string;

  @OneToMany(() => Annotation, (annotation) => annotation.cat)
  @Field(() => [Annotation], { nullable: true })
  annotations?: Promise<Annotation[]>;
}
