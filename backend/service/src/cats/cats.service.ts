import { Cat } from './entities/cat.entity';
import { CreateCatInput } from './dto/create-cat.input';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCatInput } from './dto/update-cat.input';
import { FindCatsArgs } from './dto/find-cats.args';
import { CatsRepository } from './cats.repository';

@Injectable()
export class CatsService {
  constructor(@InjectRepository(Cat) private readonly catsRepository: CatsRepository) {}

  create(createCatInput: CreateCatInput): Promise<Cat> {
    return Cat.save(Cat.create(createCatInput));
  }

  find(filter: FindCatsArgs): Promise<Cat[]> {
    let filterClause = filter ? { where: filter } : undefined;
    return this.catsRepository.find(filterClause);
  }

  findOne(id: number): Promise<Cat> {
    return this.catsRepository.findOne(id);
  }

  async update(id: number, updateCatInput: UpdateCatInput): Promise<Cat> {
    const cat = await this.catsRepository.findOne({ id });
    Object.assign(cat, updateCatInput);
    return cat.save();
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.catsRepository.delete({ id });
    return result.affected > 0;
  }
}
