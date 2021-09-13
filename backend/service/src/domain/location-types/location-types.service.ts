import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/common/base-crud.service';
import { Repository } from 'typeorm';
import { LocationType } from './entities/location-type.entity';

@Injectable()
export class LocationTypesService extends BaseCrudService<LocationType> {
  constructor(@InjectRepository(LocationType) repository: Repository<LocationType>) {
    super(repository);
  }
}
