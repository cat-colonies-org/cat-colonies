import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/domain/users/entities/user.entity';

@Entity()
@ObjectType()
export class UserAnnotation extends BaseEntity {
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
  userId: number;

  @ManyToOne(() => User, (user) => user.annotations)
  @Field(() => User)
  user: Promise<User>;
}
