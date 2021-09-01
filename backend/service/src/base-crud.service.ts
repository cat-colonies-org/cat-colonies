import { BaseEntity, Repository } from 'typeorm';

export class BaseCrudService<T extends BaseEntity> {
  constructor(private readonly repository: Repository<T>) {}

  async create(createInput: Record<string, any>): Promise<T> {
    const entity: T = this.repository.create();
    if (!entity) return;
    Object.assign(entity, createInput);
    return await entity.save();
  }

  find(filter: Record<string, any>): Promise<T[]> {
    const filterClause = filter ? { where: filter } : undefined;
    return this.repository.find(filterClause);
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
