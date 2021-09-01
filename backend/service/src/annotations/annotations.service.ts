import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/base-crud.service';
import { Repository } from 'typeorm';
import { CreateAnnotationInput } from './dto/create-annotation.input';
import { UpdateAnnotationInput } from './dto/update-annotation.input';
import { Annotation } from './entities/annotation.entity';

@Injectable()
export class AnnotationsService extends BaseCrudService<Annotation> {
  constructor(@InjectRepository(Annotation) repository: Repository<Annotation>) {
    super(repository);
  }
}
