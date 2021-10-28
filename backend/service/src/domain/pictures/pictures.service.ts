import { BaseCrudService } from 'src/common/base-crud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Picture } from './entities/picture.entity';
import { Repository } from 'typeorm';

export class PicturesService extends BaseCrudService<Picture> {
  constructor(@InjectRepository(Picture) repository: Repository<Picture>) {
    super(repository);
  }
}
