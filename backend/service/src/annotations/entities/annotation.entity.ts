import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Cat } from 'src/cats/entities/cat.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
