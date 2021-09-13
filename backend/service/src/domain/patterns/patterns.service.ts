import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/common/base-crud.service';
import { Repository } from 'typeorm';
import { Pattern } from './entities/pattern.entity';

@Injectable()
export class PatternsService extends BaseCrudService<Pattern> {
  constructor(@InjectRepository(Pattern) repository: Repository<Pattern>) {
    super(repository);
  }
}
