import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateColonyInput } from './dto/create-colony.input';
import { UpdateColonyInput } from './dto/update-colony.input';
import { Colony } from './entities/colony.entity';

@Injectable()
export class ColoniesService {
  constructor(
    @InjectRepository(Colony)
    private readonly colonyRepository: Repository<Colony>,
  ) {}

  create(createColonyInput: CreateColonyInput) {
    return 'This action adds a new colony';
  }

  findAll(): Promise<Colony[]> {
    return this.colonyRepository.find({ relations: ['locationType'] });
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
