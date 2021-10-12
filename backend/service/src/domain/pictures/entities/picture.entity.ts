import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cat } from 'src/domain/cats/entities/cat.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Picture extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => Int)
  catId: number;

  @Column()
  @Field(() => Date)
  createdAt: Date;

  @Column()
  @Field(() => String)
  originalFilename: string;

  @Column()
  @Field(() => String)
  image: string;

  @Column()
  @Field(() => String)
  thumbnail: string;

  @ManyToOne(() => Cat, (cat) => cat.annotations)
  @Field(() => Cat)
  cat: Promise<Cat>;
}
