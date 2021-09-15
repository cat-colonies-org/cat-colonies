import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { BaseCrudService } from 'src/common/base-crud.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseCrudService<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  override async create(createInput: Record<string, any>): Promise<User> {
    const user: User = this.repository.create();
    if (!user) return;
    Object.assign(user, createInput);
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    return await user.save();
  }
}
