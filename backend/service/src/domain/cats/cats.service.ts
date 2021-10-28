import { Cat } from './entities/cat.entity';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseCrudService } from 'src/common/base-crud.service';
import { User } from '../users/entities/user.entity';
import { Roles } from '../roles/entities/role.entity';
import { omit } from 'src/util';
import { REQUEST } from '@nestjs/core';

export class CatsService extends BaseCrudService<Cat> {
  constructor(@Inject(REQUEST) private req: any, @InjectRepository(Cat) repository: Repository<Cat>) {
    super(repository);
  }

  private GetSecuredQueryBuilder(): SelectQueryBuilder<Cat> {
    // With GraphQL the request comes in req.req. With REST it comes in req... 🤯
    const request = this.req.req || this.req;

    const user: User = request.user;
    const qb = this.repository.createQueryBuilder('Cat');

    if (user.roleId != Roles.Administrator)
      qb.innerJoin('Cat.colony', 'colony')
        .innerJoin('colony.managers', 'user')
        .where('user.id = :userId')
        .setParameter('userId', user.id);

    return qb;
  }

  override find(opts: Record<string, any>): Promise<[Cat[], number]> {
    const { skip, take, order, descending } = opts;
    const filter = omit(opts, ['skip', 'take', 'order', 'descending']);

    return this.GetSecuredQueryBuilder()
      .andWhere(filter)
      .take(take)
      .skip(skip)
      .orderBy(order ? 'Cat.' + order : undefined, descending ? 'DESC' : 'ASC')
      .getManyAndCount();
  }

  override findOne(id: number): Promise<Cat> {
    return this.GetSecuredQueryBuilder().andWhere('Cat.id = :catId').setParameter('catId', id).getOne();
  }
}
