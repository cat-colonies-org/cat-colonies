import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ColoniesService } from './colonies.service';
import { Colony } from './entities/colony.entity';
import { CreateColonyInput } from './dto/create-colony.input';
import { UpdateColonyInput } from './dto/update-colony.input';

@Resolver(() => Colony)
export class ColoniesResolver {
  constructor(private readonly coloniesService: ColoniesService) {}

  @Mutation(() => Colony)
  createColony(@Args('createColonyInput') createColonyInput: CreateColonyInput) {
    return this.coloniesService.create(createColonyInput);
  }

  @Query(() => [Colony], { name: 'colonies' })
  findAll() {
    return this.coloniesService.findAll();
  }

  @Query(() => Colony, { name: 'colony' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.coloniesService.findOne(id);
  }

  @Mutation(() => Colony)
  updateColony(@Args('updateColonyInput') updateColonyInput: UpdateColonyInput) {
    return this.coloniesService.update(updateColonyInput.id, updateColonyInput);
  }

  @Mutation(() => Colony)
  removeColony(@Args('id', { type: () => Int }) id: number) {
    return this.coloniesService.remove(id);
  }
}
