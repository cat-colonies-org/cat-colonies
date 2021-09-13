import { BaseCrudService } from 'src/common/base-crud.service';
import { Colony } from './entities/colony.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ColoniesService extends BaseCrudService<Colony> {
  constructor(@InjectRepository(Colony) repository: Repository<Colony>) {
    super(repository);
  }
}
