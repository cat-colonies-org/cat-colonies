import { Cat } from './entities/cat.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseCrudService } from 'src/common/base-crud.service';
import { CONTEXT } from '@nestjs/graphql';
import { User } from '../users/entities/user.entity';
import { Roles } from '../roles/entities/role.entity';
import { omit } from 'src/util';

@Injectable({ scope: Scope.REQUEST })
export class CatsService extends BaseCrudService<Cat> {
  constructor(@InjectRepository(Cat) repository: Repository<Cat>, @Inject(CONTEXT) private context) {
    super(repository);
  }

  private async GetSecuredQueryBuilder(): Promise<SelectQueryBuilder<Cat>> {
    const user: User = this.context.req.user;
    const qb = this.repository.createQueryBuilder('Cat');

    if ((await user.roleId) != Roles.Administrator)
      qb.innerJoin('Cat.colony', 'colony')
        .innerJoin('colony.managers', 'user')
        .where('user.id = :userId')
        .setParameter('userId', await user.id);

    return qb;
  }

  override async find(opts: Record<string, any>): Promise<[Cat[], number]> {
    const { skip, take, order, descending } = opts;
    const filter = omit(opts, ['skip', 'take', 'order', 'descending']);

    return (await this.GetSecuredQueryBuilder())
      .andWhere(filter)
      .take(take)
      .skip(skip)
      .orderBy(order ? 'Cat.' + order : undefined, descending ? 'DESC' : 'ASC')
      .getManyAndCount();
  }

  override async findOne(id: number): Promise<Cat> {
    return (await this.GetSecuredQueryBuilder()).andWhere('Cat.id = :catId').setParameter('catId', id).getOne();
  }
}
