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

  private async GetSecuredQueryBuilder(): Promise<SelectQueryBuilder<Colony>> {
    const user: User = this.context.req.user;
    const qb = this.repository.createQueryBuilder('Colony');

    if ((await user.roleId) != Roles.Administrator)
      qb.innerJoin('Colony.managers', 'user')
        .where('user.id = :userId')
        .setParameter('userId', await user.id);

    return qb;
  }

  override async find(opts: Record<string, any>): Promise<[Colony[], number]> {
    const { skip, take, order, descending } = opts;
    const filter = omit(opts, ['skip', 'take', 'order', 'descending']);

    return (await this.GetSecuredQueryBuilder())
      .andWhere(filter)
      .take(take)
      .skip(skip)
      .orderBy(order ? 'Colony.' + order : undefined, descending ? 'DESC' : 'ASC')
      .getManyAndCount();
  }

  override async findOne(id: number): Promise<Colony> {
    return (await this.GetSecuredQueryBuilder())
      .andWhere('Colony.id = :colonyId')
      .setParameter('colonyId', id)
      .getOne();
  }
}
