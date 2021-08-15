import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CatsService } from './cats.service';
import { Cat } from './entities/cat.entity';
import { CreateCatInput } from './dto/create-cat.input';
import { UpdateCatInput } from './dto/update-cat.input';
import { Colony } from 'src/colonies/entities/colony.entity';

@Resolver(() => Cat)
export class CatsResolver {
  constructor(private readonly catsService: CatsService) {}

  @Mutation(() => Cat)
  createCat(@Args('createCatInput') createCatInput: CreateCatInput) {
    return this.catsService.create(createCatInput);
  }

  @Query(() => [Cat], { name: 'cats' })
  findAll() {
    return this.catsService.findAll();
  }

  @Query(() => Cat, { name: 'cat' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Cat> {
    return this.catsService.findOne(id);
  }

  @Mutation(() => Cat)
  updateCat(@Args('updateCatInput') updateCatInput: UpdateCatInput) {
    return this.catsService.update(updateCatInput.id, updateCatInput);
  }

  @Mutation(() => Cat)
  removeCat(@Args('id', { type: () => Int }) id: number) {
    return this.catsService.remove(id);
  }

  @ResolveField('colony', () => Colony)
  async colony(@Parent() cat: Cat) {
    console.log(cat);
    return await cat.colony;
  }
}
