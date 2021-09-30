import { BaseCrudService } from 'src/common/base-crud.service';
import { Colony } from './entities/colony.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Roles } from '../roles/entities/role.entity';
import { CONTEXT } from '@nestjs/graphql';

@Injectable({ scope: Scope.REQUEST })
export class ColoniesService extends BaseCrudService<Colony> {
  constructor(@InjectRepository(Colony) repository: Repository<Colony>, @Inject(CONTEXT) private context) {
    super(repository);
  }

  override async findOne(id: number): Promise<Colony> {
    const user: User = this.context.req.user;
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
