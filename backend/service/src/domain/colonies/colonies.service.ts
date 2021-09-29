import { BaseCrudService } from 'src/common/base-crud.service';
import { Colony } from './entities/colony.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Roles } from '../roles/entities/role.entity';

@Injectable()
export class ColoniesService extends BaseCrudService<Colony> {
  constructor(@InjectRepository(Colony) repository: Repository<Colony>) {
    super(repository);
  }

  override async findOne(id: number, user?: User): Promise<Colony> {
    if ((await user.roleId) == Roles.Administrator) return this.repository.findOne(id);

    return this.repository
      .createQueryBuilder('Colony')
      .innerJoin('Colony.managers', 'user')
      .where('Colony.id = :colonyId')
      .andWhere('user.id = :userId')
      .setParameter('colonyId', id)
      .setParameter('userId', await user.id)
      .getOne();
  }
}
