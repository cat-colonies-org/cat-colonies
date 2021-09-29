import { PubSubEngine } from 'apollo-server-express';
import { User } from 'src/domain/users/entities/user.entity';
import { BaseEntity } from 'typeorm';
import { ICrudService } from './base-crud.service';

export class BaseResolver<T extends BaseEntity> {
  addedEventId: string;
  updatedEventId: string;
  removedEventId: string;

  constructor(private readonly service: ICrudService<T>, private readonly pubSub: PubSubEngine, className: string) {
    this.addedEventId = `${className}Added`;
    this.updatedEventId = `${className}Updated`;
    this.removedEventId = `${className}Removed`;
  }

  addedEvent() {
    return this.pubSub.asyncIterator(this.addedEventId);
  }

  updatedEvent() {
    return this.pubSub.asyncIterator(this.updatedEventId);
  }

  removedEvent() {
    return this.pubSub.asyncIterator(this.removedEventId);
  }

  async create(createInputDto: any, user?: User): Promise<T> {
    const entity = await this.service.create(createInputDto, user);
    entity && this.pubSub.publish(this.addedEventId, { [this.addedEventId]: entity });
    return entity;
  }

  async update(updateInputDto: any, user?: User): Promise<T> {
    const entity = await this.service.update(updateInputDto.id, updateInputDto, user);
    entity && this.pubSub.publish(this.updatedEventId, { [this.updatedEventId]: entity });
    return entity;
  }

  async remove(id: number, user?: User): Promise<any> {
    const entity = await this.service.findOne(id, user);
    if (!entity) return { result: false };

    const result = await this.service.remove(id, user);
    result && this.pubSub.publish(this.removedEventId, { [this.removedEventId]: entity });

    return { result };
  }

  async find(filter: any, user?: User): Promise<any> {
    const [items, total] = await this.service.find(filter, user);
    return { items, total };
  }

  findOne(id: number, user?: User): Promise<any> {
    return this.service.findOne(id, user);
  }
}
