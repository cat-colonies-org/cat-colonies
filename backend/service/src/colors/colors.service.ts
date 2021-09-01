import { BaseCrudService } from 'src/base-crud.service';
import { Color } from '../colors/entities/color.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ColorsService extends BaseCrudService<Color> {
  constructor(@InjectRepository(Color) repository: Repository<Color>) {
    super(repository);
  }
}
