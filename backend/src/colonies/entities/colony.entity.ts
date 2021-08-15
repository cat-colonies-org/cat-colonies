import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Cat } from 'src/cats/entities/cat.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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
  @Field(() => LocationType)
  locationType: Promise<LocationType>;

  @OneToMany(() => Cat, (cat) => cat.colony)
  @Field(() => [Cat], { nullable: true })
  cats?: Promise<Cat[]>;
}
