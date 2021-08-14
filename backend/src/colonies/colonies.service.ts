import { Injectable } from '@nestjs/common';
import { CreateColonyInput } from './dto/create-colony.input';
import { UpdateColonyInput } from './dto/update-colony.input';

@Injectable()
export class ColoniesService {
  create(createColonyInput: CreateColonyInput) {
    return 'This action adds a new colony';
  }

  findAll() {
    return `This action returns all colonies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} colony`;
  }

  update(id: number, updateColonyInput: UpdateColonyInput) {
    return `This action updates a #${id} colony`;
  }

  remove(id: number) {
    return `This action removes a #${id} colony`;
  }
}
