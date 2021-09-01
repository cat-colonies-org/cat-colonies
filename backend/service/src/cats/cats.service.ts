import { Cat } from './entities/cat.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from 'src/base-crud.service';

@Injectable()
export class CatsService extends BaseCrudService<Cat> {
  constructor(@InjectRepository(Cat) repository: Repository<Cat>) {
    super(repository);
  }
}
