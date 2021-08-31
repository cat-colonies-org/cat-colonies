import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEyeColorInput } from './dto/create-eye-color.input';
import { UpdateEyeColorInput } from './dto/update-eye-color.input';
import { EyeColor } from './entities/eye-color.entity';

@Injectable()
export class EyeColorsService {
  constructor(@InjectRepository(EyeColor) private readonly eyeColorsRepository) {}

  create(createEyeColorInput: CreateEyeColorInput) {
    return 'This action adds a new eyeColor';
  }

  findAll() {
    return `This action returns all eyeColors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eyeColor`;
  }

  update(id: number, updateEyeColorInput: UpdateEyeColorInput) {
    return `This action updates a #${id} eyeColor`;
  }

  remove(id: number) {
    return `This action removes a #${id} eyeColor`;
  }
}
