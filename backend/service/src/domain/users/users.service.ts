import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { BaseCrudService } from 'src/common/base-crud.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './entities/user.entity';
import SettingsService from 'src/settings/settings.service';

@Injectable()
export class UsersService extends BaseCrudService<User> {
  constructor(@InjectRepository(User) repository: Repository<User>, private readonly settings: SettingsService) {
    super(repository);
  }

  override async create(createInput: Partial<User>): Promise<User> {
    const user: User = this.repository.create();
    if (!user) return;
    Object.assign(user, createInput);
    user.password = await bcrypt.hash(user.password, this.settings.auth.saltRounds);
    return await user.save();
  }

  override findOne(id: number): Promise<User> {
    return this.repository.findOneBy( {id});
  }
   
}
