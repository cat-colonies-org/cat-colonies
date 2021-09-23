import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/common/base-crud.service';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService extends BaseCrudService<Role> {
  constructor(@InjectRepository(Role) repository: Repository<Role>) {
    super(repository);
  }
}
