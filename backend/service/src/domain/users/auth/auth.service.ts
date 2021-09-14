import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCredentials } from '../dto/user-credentials';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

  async signIn(userCredentials: UserCredentials): Promise<boolean> {
    const { email, password } = userCredentials;
    const results = await this.repository.find({ email: email });

    const user = results[0];
    if (user === undefined || user.password != password) return false;

    return true;
  }
}
