import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AccessToken } from '../dto/access-token';
import { JwtPayload } from '../dto/jwt-payload.interface';
import { UserCredentials } from '../dto/user-credentials';
import { User } from '../entities/user.entity';

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
    const accessToken: AccessToken = { result: this.jwtService.sign(payload) };
    console.log(accessToken);
    return accessToken;
  }

  private async validateUserPassword(userCredentials: UserCredentials): Promise<boolean> {
    const { email, password } = userCredentials;
    const results = await this.repository.find({ email });

    const user = results[0];
    if (user === undefined) return false;
    const pass = await bcrypt.hash(password, user.salt);

    return pass === user.password;
  }
}
