import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/common/base-crud.service';
import { Repository } from 'typeorm';
import { Environment } from './entities/environment.entity';

@Injectable()
export class EnvironmentsService extends BaseCrudService<Environment> {
  constructor(@InjectRepository(Environment) repository: Repository<Environment>) {
    super(repository);
  }
}
