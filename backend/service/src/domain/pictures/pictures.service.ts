import { BaseCrudService } from 'src/common/base-crud.service';
import { CONTEXT } from '@nestjs/graphql';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Picture } from './entities/picture.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class PicturesService extends BaseCrudService<Picture> {
  constructor(@InjectRepository(Picture) repository: Repository<Picture>, @Inject(CONTEXT) private context) {
    super(repository);
  }
}
