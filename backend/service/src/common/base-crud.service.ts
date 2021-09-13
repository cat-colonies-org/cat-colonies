import { BaseEntity, Repository } from 'typeorm';
import { omit } from '../util';

export class BaseCrudService<T extends BaseEntity> {
  constructor(private readonly repository: Repository<T>) {}

  async create(createInput: Record<string, any>): Promise<T> {
    const entity: T = this.repository.create();
    if (!entity) return;
    Object.assign(entity, createInput);
    return await entity.save();
  }

  find(opts: Record<string, any>): Promise<[T[], number]> {
    const { skip, take, order, descending } = opts;
    const filter = omit(opts, ['skip', 'take', 'order', 'descending']);

    const filterClause = Object.keys(filter).length ? { where: filter } : undefined;
    const orderClause = order ? JSON.parse(JSON.stringify({ order: { [order]: descending ? -1 : 1 } })) : undefined;
    const paginationClause = skip !== undefined && take !== undefined ? { skip, take } : undefined;

    return this.repository.findAndCount({
      ...filterClause,
      ...orderClause,
      ...paginationClause,
    });
  }

  findOne(id: number): Promise<T> {
    return this.repository.findOne(id);
  }

  async update(id: number, updateInput: Record<string, any>): Promise<T> {
    const entity = await this.repository.findOne(id);
    if (!entity) return;
    Object.assign(entity, updateInput);
    return entity.save();
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}
