import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'jsonwebtoken';
import { PassportStrategy } from '@nestjs/passport';
import { Repository } from 'typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/domain/users/entities/user.entity';
import SettingsService from 'src/settings/settings.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>, settings: SettingsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: settings.auth.jwtSecret,
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
