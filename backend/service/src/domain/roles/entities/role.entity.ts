import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/domain/users/entities/user.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum Roles {
  Administrator = 1,
  Manager = 2,
}
registerEnumType(Roles, { name: 'Role', description: '' });

@Entity()
@ObjectType()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  description: string;

  @OneToMany(() => User, (user) => user.role)
  @Field(() => [User])
  users: Promise<User[]>;
}
