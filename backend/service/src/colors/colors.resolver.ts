import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Color } from './entities/color.entity';
import { CreateColorInput } from './dto/create-color.input';
import { UpdateColorInput } from './dto/update-color.input';
import { ColorsService } from './colors.service';

@Resolver(() => Color)
export class ColorsResolver {
  constructor(private readonly colorsService: ColorsService) {}

  @Mutation(() => Color)
  createColor(@Args('createColorInput') createColorInput: CreateColorInput) {
    return this.colorsService.create(createColorInput);
  }

  @Mutation(() => Color)
  updateColor(@Args('updateColorInput') updateColorInput: UpdateColorInput) {
    return this.colorsService.update(updateColorInput.id, updateColorInput);
  }

  @Mutation(() => Color)
  removeColor(@Args('id', { type: () => Int }) id: number) {
    return this.colorsService.remove(id);
  }

  @Query(() => [Color], { name: 'colors' })
  find() {
    return this.colorsService.find();
  }

  @Query(() => Color, { name: 'color' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.colorsService.findOne(id);
  }
}
