import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/domain/users/entities/user.entity';

@Entity()
@ObjectType()
export class Document extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => Int)
  userId: number;

  @Column()
  @Field(() => Date)
  createdAt: Date;

  @Column()
  @Field(() => String)
  originalFilename: string;

  @Column()
  @Field(() => String)
  document: string;

  @ManyToOne(() => User, (user) => user.documents)
  @Field(() => User)
  user: Promise<User>;
}
