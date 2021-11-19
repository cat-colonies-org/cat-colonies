import { BaseCrudService } from 'src/common/base-crud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAnnotation } from './entities/user-annotation.entity';

export class UserAnnotationsService extends BaseCrudService<UserAnnotation> {
  constructor(@InjectRepository(UserAnnotation) repository: Repository<UserAnnotation>) {
    super(repository);
  }
}
