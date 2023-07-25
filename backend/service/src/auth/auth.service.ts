import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
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

  async signIn(providedCredentials: UserCredentials): Promise<AccessToken> {
    const user = await this.repository.findOne({ email: providedCredentials.email });
    if (!(await this.validateUserPassword(providedCredentials, user)))
      throw new UnauthorizedException('Invalid credentials');

    const { email, roleId } = user;
    const payload: JwtPayload = { email, roleId };
    return { result: this.jwtService.sign(payload) };
  }

  private async validateUserPassword(providedCredentials: UserCredentials, user?: User): Promise<boolean> {
    if (!user) return false;

    return bcrypt.compare(providedCredentials.password, user.password);
  }
}
