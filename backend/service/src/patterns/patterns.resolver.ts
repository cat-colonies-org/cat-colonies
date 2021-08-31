import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PatternsService } from './patterns.service';
import { Pattern } from './entities/pattern.entity';
import { CreatePatternInput } from './dto/create-pattern.input';
import { UpdatePatternInput } from './dto/update-pattern.input';

@Resolver(() => Pattern)
export class PatternsResolver {
  constructor(private readonly patternsService: PatternsService) {}

  @Mutation(() => Pattern)
  createPattern(@Args('createPatternInput') createPatternInput: CreatePatternInput) {
    return this.patternsService.create(createPatternInput);
  }

  @Mutation(() => Pattern)
  updatePattern(@Args('updatePatternInput') updatePatternInput: UpdatePatternInput) {
    return this.patternsService.update(updatePatternInput.id, updatePatternInput);
  }

  @Mutation(() => Pattern)
  removePattern(@Args('id', { type: () => Int }) id: number) {
    return this.patternsService.remove(id);
  }

  @Query(() => [Pattern], { name: 'patterns' })
  findAll() {
    return this.patternsService.findAll();
  }

  @Query(() => Pattern, { name: 'pattern' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.patternsService.findOne(id);
  }
}
