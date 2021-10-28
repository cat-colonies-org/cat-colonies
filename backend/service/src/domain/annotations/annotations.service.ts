import { Annotation } from './entities/annotation.entity';
import { BaseCrudService } from 'src/common/base-crud.service';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'src/util';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Roles } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';

export class AnnotationsService extends BaseCrudService<Annotation> {
  constructor(@Inject(REQUEST) private req, @InjectRepository(Annotation) repository: Repository<Annotation>) {
    super(repository);
  }

  private GetSecuredQueryBuilder(): SelectQueryBuilder<Annotation> {
    // With GraphQL the request comes in req.req. With REST it comes in req... 🤯
    const request = this.req.req || this.req;

    const user: User = request.user;
    const qb = this.repository.createQueryBuilder('Annotation');

    if (user.roleId != Roles.Administrator)
      qb.innerJoin('Annotation.cat', 'Cat')
        .innerJoin('Cat.colony', 'Colony')
        .innerJoin('Colony.managers', 'user')
        .where('user.id = :userId')
        .setParameter('userId', user.id);

    return qb;
  }

  override find(opts: Record<string, any>): Promise<[Annotation[], number]> {
    const { skip, take, order, descending } = opts;
    const filter = omit(opts, ['skip', 'take', 'order', 'descending']);

    return this.GetSecuredQueryBuilder()
      .andWhere(filter)
      .take(take)
      .skip(skip)
      .orderBy(order ? 'Annotation.' + order : undefined, descending ? 'DESC' : 'ASC')
      .getManyAndCount();
  }

  override findOne(id: number): Promise<Annotation> {
    return this.GetSecuredQueryBuilder()
      .andWhere('Annotation.id = :annotationId')
      .setParameter('annotationId', id)
      .getOne();
  }
}
