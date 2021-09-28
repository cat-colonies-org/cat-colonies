import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/users/entities/user.entity';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import appConfig from 'src/configuration';
import { RolesGuard } from './guards/roles-guard';

@Module({
  imports: [
    //forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: appConfig().jwt.secret,
      signOptions: {
        expiresIn: appConfig().jwt.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy, GqlAuthGuard, RolesGuard],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
