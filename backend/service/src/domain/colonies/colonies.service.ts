import { BaseCrudService } from 'src/common/base-crud.service';
import { Colony } from './entities/colony.entity';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'src/util';
import { Repository, SelectQueryBuilder, getConnection } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Roles } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { AddColonyManagerResult } from './dto/add-colony-manager.result';
import { RemoveColonyManagerResult } from './dto/remove-colony-manager.result';

export class ColoniesService extends BaseCrudService<Colony> {
  constructor(@Inject(REQUEST) private req, @InjectRepository(Colony) repository: Repository<Colony>) {
    super(repository);
  }

  private GetSecuredQueryBuilder(): SelectQueryBuilder<Colony> {
    // With GraphQL the request comes in req.req. With REST it comes in req... 🤯
    const request = this.req.req || this.req;

    const user: User = request.user;
    const qb = this.repository.createQueryBuilder('Colony');

    if (user.roleId != Roles.Administrator)
      qb.innerJoin('Colony.managers', 'user').where('user.id = :userId').setParameter('userId', user.id);

    return qb;
  }

  override find(opts: Record<string, any>): Promise<[Colony[], number]> {
    const { skip, take, order, descending } = opts;
    const filter = omit(opts, ['skip', 'take', 'order', 'descending']);

    return this.GetSecuredQueryBuilder()
      .andWhere(filter)
      .orderBy(order ? 'Colony.' + order : undefined, descending ? 'DESC' : 'ASC')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  override findOne(id: number): Promise<Colony> {
    return this.GetSecuredQueryBuilder().andWhere('Colony.id = :colonyId').setParameter('colonyId', id).getOne();
  }

  async addManager(colony: Colony, user: User): Promise<AddColonyManagerResult> {
    const managers = await colony.managers;
    if (managers.find((m) => m.id === user.id)) return { result: false };

    managers.push(user);
    await colony.save();

    return { result: true };
  }

  async removeManager(colony: Colony, user: User): Promise<RemoveColonyManagerResult> {
    const managers = await colony.managers;
    const toBeRemoved = managers.find((m) => m.id === user.id);
    if (!toBeRemoved) return { result: false };

    managers.splice(managers.indexOf(toBeRemoved), 1);
    await colony.save();
    return { result: true };
  }
}
