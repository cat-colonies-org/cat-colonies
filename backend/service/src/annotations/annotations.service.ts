import { Injectable } from '@nestjs/common';
import { CreateAnnotationInput } from './dto/create-annotation.input';
import { UpdateAnnotationInput } from './dto/update-annotation.input';

@Injectable()
export class AnnotationsService {
  create(createAnnotationInput: CreateAnnotationInput) {
    return 'This action adds a new annotation';
  }

  findAll() {
    return `This action returns all annotations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} annotation`;
  }

  update(id: number, updateAnnotationInput: UpdateAnnotationInput) {
    return `This action updates a #${id} annotation`;
  }

  remove(id: number) {
    return `This action removes a #${id} annotation`;
  }
}
