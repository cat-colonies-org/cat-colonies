import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/common/base-crud.service';
import { omit } from 'src/util';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Roles } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { Annotation } from './entities/annotation.entity';

@Injectable({ scope: Scope.REQUEST })
export class AnnotationsService extends BaseCrudService<Annotation> {
  constructor(@InjectRepository(Annotation) repository: Repository<Annotation>, @Inject(CONTEXT) private context) {
    super(repository);
  }

  private async GetSecuredQueryBuilder(): Promise<SelectQueryBuilder<Annotation>> {
    const user: User = this.context.req.user;
    const qb = this.repository.createQueryBuilder('Annotation');

    if ((await user.roleId) != Roles.Administrator)
      qb.innerJoin('Annotation.cat', 'Cat')
        .innerJoin('Cat.colony', 'Colony')
        .innerJoin('Colony.managers', 'user')
        .where('user.id = :userId')
        .setParameter('userId', await user.id);

    return qb;
  }

  override async find(opts: Record<string, any>): Promise<[Annotation[], number]> {
    const { skip, take, order, descending } = opts;
    const filter = omit(opts, ['skip', 'take', 'order', 'descending']);

    return (await this.GetSecuredQueryBuilder())
      .andWhere(filter)
      .take(take)
      .skip(skip)
      .orderBy(order ? 'Annotation.' + order : undefined, descending ? 'DESC' : 'ASC')
      .getManyAndCount();
  }

  override async findOne(id: number): Promise<Annotation> {
    return (await this.GetSecuredQueryBuilder())
      .andWhere('Annotation.id = :annotationId')
      .setParameter('annotationId', id)
      .getOne();
  }
}
