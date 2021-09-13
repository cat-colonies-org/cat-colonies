import { AnnotationsModule } from './annotations/annotations.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { CeaseCausesModule } from './cease-causes/cease-causes.module';
import { ColoniesModule } from './colonies/colonies.module';
import { ColorsModule } from './colors/colors.module';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentsModule } from './environments/environments.module';
import { EyeColorsModule } from './eye-colors/eye-colors.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { LocationTypesModule } from './location-types/location-types.module';
import { Module } from '@nestjs/common';
import { PatternsModule } from './patterns/patterns.module';
import { PubSubModule } from './pubsub.module';
import { SeederModule } from './seeder/seeder.module';
import { TownsModule } from './towns/towns.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import appConfig from './configuration';

@Module({
  imports: [
    AnnotationsModule,
    CatsModule,
    CeaseCausesModule,
    ColoniesModule,
    ColorsModule,
    EnvironmentsModule,
    EyeColorsModule,
    LocationTypesModule,
    PatternsModule,
    PubSubModule,
    SeederModule,
    TownsModule,
    UsersModule,
    TypeOrmModule.forRoot(appConfig().orm),
    ConfigModule.forRoot({ ignoreEnvFile: true, isGlobal: true, load: [appConfig] }),
    GraphQLModule.forRoot({
      include: [
        AnnotationsModule,
        CatsModule,
        CeaseCausesModule,
        ColoniesModule,
        ColorsModule,
        EnvironmentsModule,
        EyeColorsModule,
        LocationTypesModule,
        PatternsModule,
        TownsModule,
        UsersModule,
      ],
      debug: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
