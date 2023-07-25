import { PubSubEngine } from 'apollo-server-express';
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

  async create(createInputDto: any): Promise<T> {
    const entity = await this.service.create(createInputDto);
    entity && this.pubSub.publish(this.addedEventId, { [this.addedEventId]: entity });
    return entity;
  }

  async update(updateInputDto: any): Promise<T> {
    const entity = await this.service.update(updateInputDto.id, updateInputDto);
    entity && this.pubSub.publish(this.updatedEventId, { [this.updatedEventId]: entity });
    return entity;
  }

  async remove(id: number): Promise<any> {
    const entity = await this.findOne(id);
    if (!entity) return false;
    const result = await this.service.remove(id);
    result && this.pubSub.publish(this.removedEventId, { [this.removedEventId]: entity });

    return { result };
  }

  async find(filter: any): Promise<any> {
    const [items, total] = await this.service.find(filter);
    return { items, total };
  }

  findOne(id: number): Promise<any> {
    // do not use this.repository.findOne because some services
    // override find and findOne methods to add user based security
    return this.service.findOne(id);
  }
}
