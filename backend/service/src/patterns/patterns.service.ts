import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatternInput } from './dto/create-pattern.input';
import { FindPatternArgs } from './dto/find-patterns.args';
import { UpdatePatternInput } from './dto/update-pattern.input';
import { Pattern } from './entities/pattern.entity';

@Injectable()
export class PatternsService {
  constructor(@InjectRepository(Pattern) private readonly patternsRepository: Repository<Pattern>) {}

  create(createPatternInput: CreatePatternInput): Promise<Pattern> {
    return Pattern.save(Pattern.create(createPatternInput));
  }

  find(filter: FindPatternArgs): Promise<Pattern[]> {
    let filterClause = filter ? { where: filter } : undefined;
    return this.patternsRepository.find(filterClause);
  }

  findOne(id: number): Promise<Pattern> {
    return this.patternsRepository.findOne(id);
  }

  async update(id: number, updatePatternInput: UpdatePatternInput): Promise<Pattern> {
    const pattern = await this.patternsRepository.findOne({ id });
    Object.assign(pattern, updatePatternInput);
    return pattern.save();
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.patternsRepository.delete({ id });
    return result.affected > 0;
  }
}
