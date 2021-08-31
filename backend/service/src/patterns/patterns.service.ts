import { Injectable } from '@nestjs/common';
import { CreatePatternInput } from './dto/create-pattern.input';
import { UpdatePatternInput } from './dto/update-pattern.input';

@Injectable()
export class PatternsService {
  create(createPatternInput: CreatePatternInput) {
    return 'This action adds a new pattern';
  }

  findAll() {
    return `This action returns all patterns`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pattern`;
  }

  update(id: number, updatePatternInput: UpdatePatternInput) {
    return `This action updates a #${id} pattern`;
  }

  remove(id: number) {
    return `This action removes a #${id} pattern`;
  }
}
