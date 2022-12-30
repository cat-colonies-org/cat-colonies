import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Cat } from './entities/cat.entity';
import { CatsService } from './cats.service';
import { CreateCatInput } from './dto/create-cat.input';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { UpdateCatInput } from './dto/update-cat.input';
import { RemoveCatResult } from './dto/remove-cat.result';
import { FindCatsArgs } from './dto/find-cats.args';
import { FindCatsResult } from './dto/find-cats.result';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseResolver } from 'src/common/base-resolver';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { Roles } from '../roles/entities/role.entity';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';

@Resolver(() => Cat)
export class CatsResolver extends BaseResolver<Cat> {
  constructor(service: CatsService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, Cat.name);
  }

  // #region Mutations
  @Mutation(() => Cat)
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createCat(@Args('createCatInput') createCatInput: CreateCatInput): Promise<Cat> {
    return this.create(createCatInput);
  }

  @Mutation(() => Cat)
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateCat(@Args('updateCatInput') updateCatInput: UpdateCatInput): Promise<Cat> {
    return this.update(updateCatInput);
  }

  @Mutation(() => RemoveCatResult)
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async removeCat(@Args('id', { type: () => Int }) id: number): Promise<RemoveCatResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindCatsResult, { name: 'cats', nullable: true })
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async findCats(@Args() filter: FindCatsArgs): Promise<FindCatsResult> {
    return this.find(filter);
  }

  @Query(() => Cat, { name: 'cat', nullable: true })
  @hasRoles(Roles.Manager)
  @UseGuards(GqlAuthGuard, RolesGuard)
  findOneCat(@Args('id', { type: () => Int }) id: number): Promise<Cat> {
    return this.findOne(id);
  }
  // #endregion Queries
}
