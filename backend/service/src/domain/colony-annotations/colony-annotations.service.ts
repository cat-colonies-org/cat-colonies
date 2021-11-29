import { BaseCrudService } from 'src/common/base-crud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColonyAnnotation } from './entities/colony-annotation.entity';

export class ColonyAnnotationsService extends BaseCrudService<ColonyAnnotation> {
  constructor(@InjectRepository(ColonyAnnotation) repository: Repository<ColonyAnnotation>) {
    super(repository);
  }
}
