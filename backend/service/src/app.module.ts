import { AnnotationsModule } from './domain/annotations/annotations.module';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentsModule } from './domain/environments/environments.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { PubSubModule } from './pubsub.module';
import { SeederModule } from './seeder/seeder.module';
import { TownsModule } from './domain/towns/towns.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './domain/users/users.module';
import appConfig from './configuration';
import { CatsModule } from './domain/cats/cats.module';
import { CeaseCausesModule } from './domain/cease-causes/cease-causes.module';
import { ColoniesModule } from './domain/colonies/colonies.module';
import { ColorsModule } from './domain/colors/colors.module';
import { EyeColorsModule } from './domain/eye-colors/eye-colors.module';
import { LocationTypesModule } from './domain/location-types/location-types.module';
import { PatternsModule } from './domain/patterns/patterns.module';

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
})
export class AppModule {}
