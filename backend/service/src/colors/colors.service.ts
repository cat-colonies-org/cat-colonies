import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateColorInput } from './dto/create-color.input';
import { UpdateColorInput } from './dto/update-color.input';
import { Color } from '../colors/entities/color.entity';
import { Repository } from 'typeorm';
import { FindColorsArgs } from './dto/find-colors.args';

@Injectable()
export class ColorsService {
  constructor(@InjectRepository(Color) private readonly colorsRepository: Repository<Color>) {}

  create(createColorInput: CreateColorInput): Promise<Color> {
    return Color.save(Color.create(createColorInput));
  }

  find(filter: FindColorsArgs): Promise<Color[]> {
    let filterClause = filter ? { where: filter } : undefined;
    return this.colorsRepository.find(filterClause);
  }

  findOne(id: number): Promise<Color> {
    return this.colorsRepository.findOne(id);
  }

  async update(id: number, updateColorInput: UpdateColorInput): Promise<Color> {
    const color = await this.colorsRepository.findOne({ id });
    Object.assign(color, updateColorInput);
    return color.save();
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.colorsRepository.delete({ id });
    return result.affected > 0;
  }
}
