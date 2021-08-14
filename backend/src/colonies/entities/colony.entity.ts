import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LocationType } from './location-type.entity';

@Entity()
@ObjectType()
export class Colony {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => Date)
  createdAt: Date;

  @Column()
  @Field(() => String)
  address: string;

  @ManyToOne(() => LocationType, (locationType) => locationType.colonies)
  locationType: LocationType;
}
