import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/users/entities/user.entity';
import { UsersResolver } from 'src/domain/users/users.resolver';
import { UsersService } from 'src/domain/users/users.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'tobechanged', //TODO This must be moved to configuration file
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UsersResolver, UsersService, AuthResolver, AuthService, JwtStrategy, GqlAuthGuard],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
