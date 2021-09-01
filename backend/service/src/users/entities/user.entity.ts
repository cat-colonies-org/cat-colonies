import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

//@Unique(['idCard'])
//@Unique(['email'])
//@Unique(['phoneNumber'])
@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  surnames: string;

  @Column()
  @Field(() => String)
  idCard: string;

  @Column()
  @Field(() => Int)
  phoneNumber: number;

  @Column()
  @Field(() => String)
  email: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  ceasedAt?: Date;

  @Column({ nullable: true })
  @Field(() => Boolean, { nullable: true })
  authorizesWhatsApp?: boolean;
}
