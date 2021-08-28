import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { FindAllUsersArgs } from './dto/find-all-users.args';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    return User.save(User.create(createUserInput));
  }

  findAll(filter: FindAllUsersArgs) {
    let filterClause = filter ? { where: filter } : undefined;
    return this.userRepository.find(filterClause);
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    Object.assign(user, updateUserInput);
    return user.save();
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
