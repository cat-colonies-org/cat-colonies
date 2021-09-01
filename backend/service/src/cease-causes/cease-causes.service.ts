import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/base-crud.service';
import { Repository } from 'typeorm';
import { CeaseCause } from './entities/cease-cause.entity';

@Injectable()
export class CeaseCausesService extends BaseCrudService<CeaseCause> {
  constructor(@InjectRepository(CeaseCause) repository: Repository<CeaseCause>) {
    super(repository);
  }
}
