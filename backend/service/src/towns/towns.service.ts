import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/base-crud.service';
import { Repository } from 'typeorm';
import { CreateTownInput } from './dto/create-town.input';
import { FindTownsArgs } from './dto/find-towns.args';
import { UpdateTownInput } from './dto/update-town.input';
import { Town } from './entities/town.entity';

@Injectable()
export class TownsService extends BaseCrudService<Town> {
  constructor(@InjectRepository(Town) repository: Repository<Town>) {
    super(repository);
  }
}
