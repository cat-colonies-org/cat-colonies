import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Cat } from 'src/domain/cats/entities/cat.entity';
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Color extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  description: string;

  @ManyToMany(() => Cat, (cat) => cat.colors)
  @Field(() => [Cat])
  cats: Promise<Cat[]>;
}
