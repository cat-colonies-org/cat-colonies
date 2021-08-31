import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CeaseCausesService } from './cease-causes.service';
import { CeaseCause } from './entities/cease-cause.entity';
import { CreateCeaseCauseInput } from './dto/create-cease-cause.input';
import { UpdateCeaseCauseInput } from './dto/update-cease-cause.input';

@Resolver(() => CeaseCause)
export class CeaseCausesResolver {
  constructor(private readonly ceaseCausesService: CeaseCausesService) {}

  @Mutation(() => CeaseCause)
  createCeaseCause(@Args('createCeaseCauseInput') createCeaseCauseInput: CreateCeaseCauseInput) {
    return this.ceaseCausesService.create(createCeaseCauseInput);
  }

  @Query(() => [CeaseCause], { name: 'ceaseCauses' })
  findAll() {
    return this.ceaseCausesService.findAll();
  }

  @Query(() => CeaseCause, { name: 'ceaseCause' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.ceaseCausesService.findOne(id);
  }

  @Mutation(() => CeaseCause)
  updateCeaseCause(@Args('updateCeaseCauseInput') updateCeaseCauseInput: UpdateCeaseCauseInput) {
    return this.ceaseCausesService.update(updateCeaseCauseInput.id, updateCeaseCauseInput);
  }

  @Mutation(() => CeaseCause)
  removeCeaseCause(@Args('id', { type: () => Int }) id: number) {
    return this.ceaseCausesService.remove(id);
  }
}
