import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/common/base-crud.service';
import { Repository } from 'typeorm';
import { UserCeaseCause } from './entities/user-cease-cause.entity';

@Injectable()
export class UserCeaseCausesService extends BaseCrudService<UserCeaseCause> {
  constructor(@InjectRepository(UserCeaseCause) repository: Repository<UserCeaseCause>) {
    super(repository);
  }
}
