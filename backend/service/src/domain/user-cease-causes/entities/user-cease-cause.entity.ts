import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/domain/users/entities/user.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class UserCeaseCause extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  description: string;

  @OneToMany(() => User, (user) => user.ceaseCause)
  @Field(() => [User])
  users: Promise<User[]>;
}
