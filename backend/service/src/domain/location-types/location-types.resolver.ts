import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { LocationType } from './entities/location-type.entity';
import { LocationTypesService } from './location-types.service';
import { CreateLocationTypeInput } from './dto/create-location-type.input';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub.module';
import { UpdateLocationTypeInput } from './dto/update-location-type.input';
import { RemoveLocationTypeResult } from './dto/remove-location-type.result';
import { FindLocationTypesArgs } from './dto/find-location-types.args';
import { FindLocationTypesResult } from './dto/find-location-types.result';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseResolver } from 'src/common/base-resolver';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { Roles } from '../roles/entities/role.entity';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';

@Resolver(() => LocationType)
export class LocationTypesResolver extends BaseResolver<LocationType> {
  constructor(service: LocationTypesService, @Inject(PUB_SUB) pubSub: PubSubEngine) {
    super(service, pubSub, LocationType.name);
  }

  // #region Subscriptions
  @Subscription(() => LocationType)
  locationTypeAdded() {
    return this.addedEvent();
  }

  @Subscription(() => LocationType)
  locationTypeUpdated() {
    return this.updatedEvent();
  }

  @Subscription(() => LocationType)
  locationTypeRemoved() {
    return this.removedEvent();
  }
  // #endregion Subscriptions

  // #region Mutations
  @Mutation(() => LocationType)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createLocationType(
    @Args('createLocationTypeInput') createLocationTypeInput: CreateLocationTypeInput,
  ): Promise<LocationType> {
    return this.create(createLocationTypeInput);
  }

  @Mutation(() => LocationType)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateLocationType(
    @Args('updateLocationTypeInput') updateLocationTypeInput: UpdateLocationTypeInput,
  ): Promise<LocationType> {
    return this.update(updateLocationTypeInput);
  }

  @Mutation(() => RemoveLocationTypeResult)
  @hasRoles(Roles.Administrator)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async removeLocationType(@Args('id', { type: () => Int }) id: number): Promise<RemoveLocationTypeResult> {
    return this.remove(id);
  }
  // #endregion Mutations

  // #region Queries
  @Query(() => FindLocationTypesResult, { name: 'locationTypes', nullable: true })
  @UseGuards(GqlAuthGuard)
  async findLocationTypes(@Args() filter: FindLocationTypesArgs): Promise<FindLocationTypesResult> {
    return this.find(filter);
  }

  @Query(() => LocationType, { name: 'locationType', nullable: true })
  @UseGuards(GqlAuthGuard)
  findOneLocationType(@Args('id', { type: () => Int }) id: number): Promise<LocationType> {
    return this.findOne(id);
  }
  // #endregion Queries
}
