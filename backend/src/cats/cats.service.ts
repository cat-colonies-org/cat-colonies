import { Cat } from './entities/cat.entity';
import { CreateCatInput } from './dto/create-cat.input';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCatInput } from './dto/update-cat.input';
import { PartialType } from '@nestjs/graphql';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat) private readonly catsRepository: Repository<Cat>,
  ) {}

  create(createCatInput: CreateCatInput): Promise<Cat> {
    const cat: Cat = Cat.create({
      createdAt: new Date(),
      ...createCatInput,
    });

    return Cat.save(cat);
  }

  findAll() {
    return this.catsRepository.find();
  }

  findOne(id: number): Promise<Cat> {
    return this.catsRepository.findOne({ id });
  }

  async update(id: number, updateCatInput: UpdateCatInput): Promise<Cat> {
    const cat = await this.catsRepository.findOne({ id });
    Object.assign(cat, updateCatInput);
    return cat.save();
  }

  async remove(id: number): Promise<Boolean> {
    const result = await this.catsRepository.delete({ id }); // TODO: Return our result
    return result.affected > 0;
  }
}
