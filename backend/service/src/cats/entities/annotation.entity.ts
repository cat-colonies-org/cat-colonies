import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cat } from './cat.entity';

@Entity()
@ObjectType()
export class Annotation extends BaseEntity {
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
  catId: number;

  @ManyToOne(() => Cat, (cat) => cat.annotations)
  @Field(() => Cat)
  cat: Promise<Cat>;
}
