import { Annotation } from 'src/domain/annotations/entities/annotation.entity';
import { CeaseCause } from 'src/domain/cease-causes/entities/cease-cause.entity';
import { Colony } from 'src/domain/colonies/entities/colony.entity';
import { Color } from 'src/domain/colors/entities/color.entity';
import { EyeColor } from 'src/domain/eye-colors/entities/eye-color.entity';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Pattern } from 'src/domain/patterns/entities/pattern.entity';
import { Picture } from 'src/domain/pictures/entities/picture.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Unknown = 'Unknown',
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
  @Field(() => Date, { nullable: true })
  bornAt?: Date;

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
  patternId?: number;

  @ManyToOne(() => Pattern, (pattern) => pattern.cats)
  @Field(() => Pattern, { nullable: true })
  pattern?: Promise<Pattern>;

  @Column({ nullable: true })
  @Field(() => Gender, { nullable: true })
  gender?: Gender;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  eyeColorId?: number;

  @ManyToOne(() => EyeColor, (eyeColors) => eyeColors.cats)
  @Field(() => EyeColor, { nullable: true })
  eyeColor?: Promise<EyeColor>;

  @ManyToMany(() => Color, (color) => color.cats)
  @JoinTable()
  @Field(() => [Color], { nullable: true })
  colors?: Promise<Color[]>;

  @OneToMany(() => Annotation, (annotation) => annotation.cat)
  @Field(() => [Annotation], { nullable: true })
  annotations?: Promise<Annotation[]>;

  @OneToMany(() => Picture, (picture) => picture.cat)
  @Field(() => [Picture], { nullable: true })
  pictures?: Promise<Picture[]>;
}
