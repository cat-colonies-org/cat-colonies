import { BaseEntity, Repository, ILike } from 'typeorm';
import { omit } from '../util';

export interface ICrudService<T> {
  create(createInput: Record<string, any>): Promise<T>;
  find(opts: Record<string, any>): Promise<[T[], number]>;
  findOne(id: number): Promise<T>;
  update(id: number, updateInput: Record<string, any>): Promise<T>;
  remove(id: number): Promise<boolean>;
}

export class BaseCrudService<T extends BaseEntity> implements ICrudService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(createInput: Record<string, any>): Promise<T> {
    const entity: T = this.repository.create();
    if (!entity) return;
    Object.assign(entity, createInput);
    return await entity.save();
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async find(opts: Record<string, any>): Promise<[T[], number]> {
    const { skip, take, order, descending } = opts;
    const filter = omit(opts, ['skip', 'take', 'order', 'descending']);

    const findOptions = {
      order: JSON.parse(`{ "${order}": ${descending ? -1 : 1} }`),
      skip,
      take,
    };

    if (Object.entries(filter).length != 0) {
      // Allow searching for partial strings ignoring case
      const conditions: any = Object.entries(filter).map(([field, value]) => {
        return typeof value === 'string' ? { [field]: ILike(`%${value}%`) } : { [field]: value };
      });
      Object.entries(findOptions).push(['where', conditions]);
    }

    return this.repository.findAndCount(findOptions);
  }

  findOne(id: number): Promise<T> {
    return this.repository.findOne({ id: id } as any);
  }

  async update(id: number, updateInput: Record<string, any>): Promise<T> {
    // do not use this.repository.findOne because some services
    // override find and findOne methods to add user based security
    const entity = await this.findOne(id);
    if (!entity) return;
    Object.assign(entity, updateInput);
    return entity.save();
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}
