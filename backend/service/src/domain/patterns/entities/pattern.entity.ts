import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Cat } from 'src/domain/cats/entities/cat.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Pattern extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  description: string;

  @OneToMany(() => Cat, (cat) => cat.pattern)
  @Field(() => [Cat])
  cats: Promise<Cat[]>;
}
