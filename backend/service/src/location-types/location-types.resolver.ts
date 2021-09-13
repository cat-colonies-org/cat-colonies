import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { LocationTypesService } from './location-types.service';
import { CreateLocationTypeInput } from './dto/create-location-type.input';
import { UpdateLocationTypeInput } from './dto/update-location-type.input';
import { LocationType } from './entities/location-type.entity';
import { FindLocationTypeArgs } from './dto/find-location-types.args';
import { Inject } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub.module';
import { RemoveLocationTypeResult } from './dto/remove-location-type.result';
import { FindLocationTypesResult } from './dto/find-location-types.result';

const LOCATION_TYPE_ADDED_EVENT = 'locationTypeAdded';
const LOCATION_TYPE_UPDATED_EVENT = 'locationTypeUpdated';
const LOCATION_TYPE_REMOVED_EVENT = 'locationTypeRemoved';

@Resolver(() => LocationType)
export class LocationTypesResolver {
  constructor(
    private readonly locationTypesService: LocationTypesService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  // #region Subscriptions
  @Subscription(() => LocationType)
  locationTypeAdded() {
    return this.pubSub.asyncIterator(LOCATION_TYPE_ADDED_EVENT);
  }

  @Subscription(() => LocationType)
  locationTypeUpdated() {
    return this.pubSub.asyncIterator(LOCATION_TYPE_UPDATED_EVENT);
  }

  @Subscription(() => LocationType)
  locationTypeRemoved() {
    return this.pubSub.asyncIterator(LOCATION_TYPE_REMOVED_EVENT);
  }

  // #endregion

  // #region Mutations
  @Mutation(() => LocationType)
  async createLocationType(
    @Args('createLocationTypeInput') createLocationTypeInput: CreateLocationTypeInput,
  ): Promise<LocationType> {
    const locationType = this.locationTypesService.create(createLocationTypeInput);
    locationType && this.pubSub.publish(LOCATION_TYPE_ADDED_EVENT, { [LOCATION_TYPE_ADDED_EVENT]: locationType });
    return locationType;
  }

  @Mutation(() => LocationType)
  async updateLocationType(
    @Args('updateLocationTypeInput') updateLocationTypeInput: UpdateLocationTypeInput,
  ): Promise<LocationType> {
    const locationType = await this.locationTypesService.update(updateLocationTypeInput.id, updateLocationTypeInput);
    locationType && this.pubSub.publish(LOCATION_TYPE_UPDATED_EVENT, { [LOCATION_TYPE_UPDATED_EVENT]: locationType });
    return locationType;
  }

  @Mutation(() => LocationType)
  async removeLocationType(@Args('id', { type: () => Int }) id: number): Promise<RemoveLocationTypeResult> {
    const locationType = await this.locationTypesService.findOne(id);
    if (!locationType) return { result: false };

    const result = await this.locationTypesService.remove(id);
    result && this.pubSub.publish(LOCATION_TYPE_REMOVED_EVENT, { [LOCATION_TYPE_REMOVED_EVENT]: locationType });

    return { result };
  }

  // #endregion Mutations

  // #region Queries
  @Query(() => FindLocationTypesResult, { name: 'locationTypes' })
  async find(@Args() filter: FindLocationTypeArgs): Promise<FindLocationTypesResult> {
    const [items, total] = await this.locationTypesService.find(filter);
    return { items, total };
  }

  @Query(() => LocationType, { name: 'locationType', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<LocationType> {
    return this.locationTypesService.findOne(id);
  }

  // #endregion Queries
}
