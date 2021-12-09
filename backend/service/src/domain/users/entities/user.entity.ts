import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Colony } from 'src/domain/colonies/entities/colony.entity';
import { Role } from 'src/domain/roles/entities/role.entity';
import { UserAnnotation } from 'src/domain/user-annotations/entities/user-annotation.entity';
import { UserCeaseCause } from 'src/domain/user-cease-causes/entities/user-cease-cause.entity';
import { Document } from 'src/domain/documents/entities/document.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

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
  @Field(() => String)
  phoneNumber: string;

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
  @Field(() => Int, { nullable: true })
  ceaseCauseId?: number;

  @ManyToOne(() => UserCeaseCause, (ceaseCause) => ceaseCause.users)
  @Field(() => UserCeaseCause, { nullable: true })
  ceaseCause?: Promise<UserCeaseCause>;

  @Column({ nullable: true })
  @Field(() => Boolean, { nullable: true })
  authorizesWhatsApp?: boolean;

  @Column()
  @Field(() => String)
  password: string;

  @ManyToMany(() => Colony, (colony) => colony.managers)
  @JoinTable()
  @Field(() => [Colony])
  colonies: Promise<Colony[]>;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  roleId?: number;

  @ManyToOne(() => Role, (role) => role.users)
  @Field(() => Role, { nullable: true })
  role?: Promise<Role>;

  @OneToMany(() => UserAnnotation, (annotation) => annotation.user)
  @Field(() => [UserAnnotation], { nullable: true })
  annotations?: Promise<UserAnnotation[]>;

  @OneToMany(() => Document, (document) => document.user)
  @Field(() => [Document], { nullable: true })
  documents?: Promise<Document[]>;
}
