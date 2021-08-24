import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Cat } from 'src/cats/entities/cat.entity';
import { Town } from 'src/towns/entities/town.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Environment } from './environment.entity';
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

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  locationTypeId?: number;

  @ManyToOne(() => LocationType, (locationType) => locationType.colonies)
  @Field(() => LocationType)
  locationType: Promise<LocationType>;

  @OneToMany(() => Cat, (cat) => cat.colony)
  @Field(() => [Cat], { nullable: true })
  cats?: Promise<Cat[]>;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  environmentId?: number;

  @ManyToOne(() => Environment, (environment) => environment.colonies)
  @Field(() => Environment)
  environment: Promise<Environment>;

  @Column()
  @Field(() => Int)
  townId: number;

  @ManyToOne(() => Town, (town) => town.colonies)
  @Field(() => Town)
  town: Promise<Town>;
}
