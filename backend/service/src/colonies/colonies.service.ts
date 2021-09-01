import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateColonyInput } from './dto/create-colony.input';
import { FindColoniesArgs } from './dto/find-colonies.args';
import { UpdateColonyInput } from './dto/update-colony.input';
import { Colony } from './entities/colony.entity';

@Injectable()
export class ColoniesService {
  constructor(@InjectRepository(Colony) private readonly coloniesRepository: Repository<Colony>) {}

  create(createColonyInput: CreateColonyInput): Promise<Colony> {
    return Colony.save(Colony.create(createColonyInput));
  }

  find(filter: FindColoniesArgs): Promise<Colony[]> {
    let filterClause = filter ? { where: filter } : undefined;
    return this.coloniesRepository.find(filterClause);
  }

  findOne(id: number): Promise<Colony> {
    return this.coloniesRepository.findOne(id);
  }

  async update(id: number, updateColonyInput: UpdateColonyInput): Promise<Colony> {
    const colony = await this.coloniesRepository.findOne(id);
    Object.assign(colony, updateColonyInput);
    return colony.save();
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.coloniesRepository.delete(id);
    return result.affected > 0;
  }
}
