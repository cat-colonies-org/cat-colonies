import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTownInput } from './dto/create-town.input';
import { FindTownsArgs } from './dto/find-towns.args';
import { UpdateTownInput } from './dto/update-town.input';
import { Town } from './entities/town.entity';

@Injectable()
export class TownsService {
  constructor(@InjectRepository(Town) private readonly townsRepository: Repository<Town>) {}

  create(createTownInput: CreateTownInput): Promise<Town> {
    return Town.save(Town.create(createTownInput));
  }

  find(filter: FindTownsArgs): Promise<Town[]> {
    let filterClause = filter ? { where: filter } : undefined;
    return this.townsRepository.find(filterClause);
  }

  findOne(id: number): Promise<Town> {
    return this.townsRepository.findOne(id);
  }

  async update(id: number, updateTownInput: UpdateTownInput): Promise<Town> {
    const town = await this.townsRepository.findOne({ id });
    Object.assign(town, updateTownInput);
    return town.save();
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.townsRepository.delete({ id });
    return result.affected > 0;
  }
}
