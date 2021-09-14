import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique(['idCard'])
@Unique(['email'])
@Unique(['phoneNumber'])
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

  @Column()
  @Field(() => String)
  password: string;

  @Column()
  @Field(() => String)
  salt: string;

  // validEmail(email: string): boolean {
  //   const re = new RegExp(
  //     "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*" +
  //       '@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?',
  //   );
  //   return re.test(email);
  // }
}
