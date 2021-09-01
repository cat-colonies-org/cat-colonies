import { Cat } from './entities/cat.entity';
import { CreateCatInput } from './dto/create-cat.input';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCatInput } from './dto/update-cat.input';
import { FindCatsArgs } from './dto/find-cats.args';
import { Repository } from 'typeorm';
import { BaseCrudService } from 'src/base-crud.service';

@Injectable()
export class CatsService extends BaseCrudService<Cat> {
  constructor(@InjectRepository(Cat) repository: Repository<Cat>) {
    super(repository);
  }
}
