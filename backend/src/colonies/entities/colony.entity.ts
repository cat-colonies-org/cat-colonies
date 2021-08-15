import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LocationType } from './location-type.entity';

@Entity()
@ObjectType()
export class Colony extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Column()
  @Field(() => String)
  address: string;

  @ManyToOne(() => LocationType, (locationType) => locationType.colonies)
  @Field(() => String)
  locationType: LocationType;
}
