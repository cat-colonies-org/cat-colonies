import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateColorInput } from './dto/create-color.input';
import { UpdateColorInput } from './dto/update-color.input';
import { Color } from './entities/color.entity';

@Injectable()
export class ColorsService {
  constructor(@InjectRepository(Color) private readonly colorsRepository) {}

  create(createColorInput: CreateColorInput) {
    return 'This action adds a new color';
  }

  find() {
    return `This action returns all colors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} color`;
  }

  update(id: number, updateColorInput: UpdateColorInput) {
    return `This action updates a #${id} color`;
  }

  remove(id: number) {
    return `This action removes a #${id} color`;
  }
}
