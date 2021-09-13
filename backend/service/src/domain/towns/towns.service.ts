import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/common/base-crud.service';
import { Repository } from 'typeorm';
import { Town } from './entities/town.entity';

@Injectable()
export class TownsService extends BaseCrudService<Town> {
  constructor(@InjectRepository(Town) repository: Repository<Town>) {
    super(repository);
  }
}
