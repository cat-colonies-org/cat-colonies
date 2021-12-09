import { BaseCrudService } from 'src/common/base-crud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';

export class DocumentsService extends BaseCrudService<Document> {
  constructor(@InjectRepository(Document) repository: Repository<Document>) {
    super(repository);
  }
}
