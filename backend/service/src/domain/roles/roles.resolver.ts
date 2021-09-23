import { Inject } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseResolver } from 'src/common/base-resolver';
import { PUB_SUB } from 'src/pubsub.module';
import { CreateRoleInput } from './dto/create-role.input';
import { FindRolesArgs } from './dto/find-roles.args';
import { FindRolesResult } from './dto/find-roles.result';
import { RemoveRoleResult } from './dto/remove-role.result';
import { UpdateRoleInput } from './dto/update-role.input';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';

@Resolver(() => Role)
export class RolesResolver extends BaseResolver<Role> {
  constructor(service: RolesService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, Role.name);
  }

  // #region Subscriptions
  @Subscription(() => Role)
  patternAdded() {
    return this.addedEvent();
  }

  @Subscription(() => Role)
  patternUpdated() {
    return this.updatedEvent();
  }

  @Subscription(() => Role)
  patternRemoved() {
    return this.removedEvent();
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => Role)
  async createRole(@Args('createRoleInput') createRoleInput: CreateRoleInput): Promise<Role> {
    return this.create(createRoleInput);
  }

  @Mutation(() => Role)
  async updateRole(@Args('updateRoleInput') updateRoleInput: UpdateRoleInput): Promise<Role> {
    return this.update(updateRoleInput);
  }

  @Mutation(() => RemoveRoleResult)
  async removeRole(@Args('id', { type: () => Int }) id: number): Promise<RemoveRoleResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindRolesResult, { name: 'roles', nullable: true })
  async findRoles(@Args() filter: FindRolesArgs): Promise<FindRolesResult> {
    return this.find(filter);
  }

  @Query(() => Role, { name: 'role', nullable: true })
  findOneRole(@Args('id', { type: () => Int }) id: number): Promise<Role> {
    return this.findOne(id);
  }
  // #endregion Queries
}
