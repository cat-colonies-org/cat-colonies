import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'jsonwebtoken';
import { Strategy, ExtractJwt } from 'passport-jwt';
import appConfig from 'src/configuration';
import { User } from 'src/domain/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfig().jwt.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    const user = await this.repository.findOne({ email: email });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
