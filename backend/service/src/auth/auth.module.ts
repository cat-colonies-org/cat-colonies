import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './guards/roles-guard';
import { SettingsModule } from 'src/settings/settings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/users/entities/user.entity';
import SettingsService from 'src/settings/settings.service';

@Module({
  imports: [
    SettingsModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [SettingsModule],
      inject: [SettingsService],
      useFactory: async (settings: SettingsService) => ({
        secret: settings.jwt.secret,
        signOptions: {
          expiresIn: settings.jwt.expiresIn,
        },
      }),
    }),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy, GqlAuthGuard, RolesGuard],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
