import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/base-crud.service';
import { Repository } from 'typeorm';
import { CreatePatternInput } from './dto/create-pattern.input';
import { FindPatternArgs } from './dto/find-patterns.args';
import { UpdatePatternInput } from './dto/update-pattern.input';
import { Pattern } from './entities/pattern.entity';

@Injectable()
export class PatternsService extends BaseCrudService<Pattern> {
  constructor(@InjectRepository(Pattern) repository: Repository<Pattern>) {
    super(repository);
  }
}
