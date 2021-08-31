import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TownsService } from './towns.service';
import { Town } from './entities/town.entity';
import { CreateTownInput } from './dto/create-town.input';
import { UpdateTownInput } from './dto/update-town.input';

@Resolver(() => Town)
export class TownsResolver {
  constructor(private readonly townsService: TownsService) {}

  @Mutation(() => Town)
  createTown(@Args('createTownInput') createTownInput: CreateTownInput) {
    return this.townsService.create(createTownInput);
  }

  @Query(() => [Town], { name: 'towns' })
  findAll() {
    return this.townsService.findAll();
  }

  @Query(() => Town, { name: 'town' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.townsService.findOne(id);
  }

  @Mutation(() => Town)
  updateTown(@Args('updateTownInput') updateTownInput: UpdateTownInput) {
    return this.townsService.update(updateTownInput.id, updateTownInput);
  }

  @Mutation(() => Town)
  removeTown(@Args('id', { type: () => Int }) id: number) {
    return this.townsService.remove(id);
  }
}
