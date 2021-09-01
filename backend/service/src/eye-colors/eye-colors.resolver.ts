import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EyeColorsService } from './eye-colors.service';
import { EyeColor } from './entities/eye-color.entity';
import { CreateEyeColorInput } from './dto/create-eye-color.input';
import { UpdateEyeColorInput } from './dto/update-eye-color.input';
import { FindEyeColorsArgs } from './dto/find-eye-colors.args';

@Resolver(() => EyeColor)
export class EyeColorsResolver {
  constructor(private readonly eyeColorsService: EyeColorsService) {}

  @Mutation(() => EyeColor)
  createEyeColor(@Args('createEyeColorInput') createEyeColorInput: CreateEyeColorInput) {
    return this.eyeColorsService.create(createEyeColorInput);
  }

  @Query(() => [EyeColor], { name: 'eyeColors' })
  find(@Args() filter: FindEyeColorsArgs): Promise<EyeColor[]> {
    return this.eyeColorsService.find(filter);
  }

  @Query(() => EyeColor, { name: 'eyeColor' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.eyeColorsService.findOne(id);
  }

  @Mutation(() => EyeColor)
  updateEyeColor(@Args('updateEyeColorInput') updateEyeColorInput: UpdateEyeColorInput) {
    return this.eyeColorsService.update(updateEyeColorInput.id, updateEyeColorInput);
  }

  @Mutation(() => EyeColor)
  removeEyeColor(@Args('id', { type: () => Int }) id: number) {
    return this.eyeColorsService.remove(id);
  }
}
