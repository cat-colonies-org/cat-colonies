import { Injectable } from '@nestjs/common';
import { CreateCeaseCauseInput } from './dto/create-cease-cause.input';
import { UpdateCeaseCauseInput } from './dto/update-cease-cause.input';

@Injectable()
export class CeaseCausesService {
  create(createCeaseCauseInput: CreateCeaseCauseInput) {
    return 'This action adds a new ceaseCause';
  }

  findAll() {
    return `This action returns all ceaseCauses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ceaseCause`;
  }

  update(id: number, updateCeaseCauseInput: UpdateCeaseCauseInput) {
    return `This action updates a #${id} ceaseCause`;
  }

  remove(id: number) {
    return `This action removes a #${id} ceaseCause`;
  }
}
