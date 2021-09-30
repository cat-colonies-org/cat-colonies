import { BaseCrudService } from 'src/common/base-crud.service';
import { Colony } from './entities/colony.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Roles } from '../roles/entities/role.entity';
import { CONTEXT } from '@nestjs/graphql';
import { omit } from 'src/util';

@Injectable({ scope: Scope.REQUEST })
export class ColoniesService extends BaseCrudService<Colony> {
  constructor(@InjectRepository(Colony) repository: Repository<Colony>, @Inject(CONTEXT) private context) {
    super(repository);
  }

  private async addSecurity(qb: SelectQueryBuilder<Colony>): Promise<SelectQueryBuilder<Colony>> {
    const user: User = this.context.req.user;
    if ((await user.roleId) != Roles.Administrator)
      qb.innerJoin('Colony.managers', 'user')
        .andWhere('user.id = :userId')
        .setParameter('userId', await user.id);

    return qb;
  }

  override async find(opts: Record<string, any>): Promise<[Colony[], number]> {
    const { skip, take, order, descending } = opts;
    const filter = omit(opts, ['skip', 'take', 'order', 'descending']);

    let qb = this.repository
      .createQueryBuilder('Colony')
      .where(filter)
      .take(take)
      .skip(skip)
      .orderBy(order ? 'Colony.' + order : undefined, descending ? 'DESC' : 'ASC');

    qb = await this.addSecurity(qb);
    return qb.getManyAndCount();
  }

  override async findOne(id: number): Promise<Colony> {
    let qb = this.repository.createQueryBuilder('Colony').where('Colony.id = :colonyId').setParameter('colonyId', id);

    qb = await this.addSecurity(qb);
    return qb.getOne();
  }
}
