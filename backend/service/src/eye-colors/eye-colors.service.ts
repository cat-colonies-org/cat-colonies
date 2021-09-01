import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/base-crud.service';
import { EyeColor } from './entities/eye-color.entity';

@Injectable()
export class EyeColorsService extends BaseCrudService<EyeColor> {
  constructor(@InjectRepository(EyeColor) repository) {
    super(repository);
  }
}
