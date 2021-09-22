import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AccessToken } from './dto/access-token';
import { JwtPayload } from './dto/jwt-payload.interface';
import { UserCredentials } from './dto/user-credentials';
import { User } from '../domain/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(userCredentials: UserCredentials): Promise<AccessToken> {
    if (!(await this.validateUserPassword(userCredentials))) throw new UnauthorizedException('Invalid credentials');

    const { email } = userCredentials;
    const payload: JwtPayload = { email };
    return { result: this.jwtService.sign(payload) };
  }

  private async validateUserPassword(userCredentials: UserCredentials): Promise<boolean> {
    const { email, password } = userCredentials;
    const user = await this.repository.findOne({ email: email });
    if (!user) return false;

    return user.password === (await bcrypt.hash(password, user.salt));
  }
}
