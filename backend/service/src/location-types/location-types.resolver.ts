import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LocationTypesService } from './location-types.service';
import { CreateLocationTypeInput } from './dto/create-location-type.input';
import { UpdateLocationTypeInput } from './dto/update-location-type.input';
import { LocationType } from './entities/location-type.entity';
import { FindLocationTypeArgs } from './dto/find-location-types.args';

@Resolver(() => LocationType)
export class LocationTypesResolver {
  constructor(private readonly locationTypesService: LocationTypesService) {}

  @Mutation(() => LocationType)
  createLocationType(@Args('createLocationTypeInput') createLocationTypeInput: CreateLocationTypeInput) {
    return this.locationTypesService.create(createLocationTypeInput);
  }

  @Query(() => [LocationType], { name: 'locationTypes' })
  find(@Args() filter: FindLocationTypeArgs): Promise<LocationType[]> {
    return this.locationTypesService.find(filter);
  }

  @Query(() => LocationType, { name: 'locationType' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.locationTypesService.findOne(id);
  }

  @Mutation(() => LocationType)
  updateLocationType(@Args('updateLocationTypeInput') updateLocationTypeInput: UpdateLocationTypeInput) {
    return this.locationTypesService.update(updateLocationTypeInput.id, updateLocationTypeInput);
  }

  @Mutation(() => LocationType)
  removeLocationType(@Args('id', { type: () => Int }) id: number) {
    return this.locationTypesService.remove(id);
  }
}
