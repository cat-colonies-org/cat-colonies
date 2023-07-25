import { AnnotationsModule } from './domain/annotations/annotations.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { CatsModule } from './domain/cats/cats.module';
import { CeaseCausesModule } from './domain/cease-causes/cease-causes.module';
import { ColoniesModule } from './domain/colonies/colonies.module';
import { ColonyAnnotationsModule } from './domain/colony-annotations/colony-annotations.module';
import { ColorsModule } from './domain/colors/colors.module';
import { EnvironmentsModule } from './domain/environments/environments.module';
import { EyeColorsModule } from './domain/eye-colors/eye-colors.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { LocationTypesModule } from './domain/location-types/location-types.module';
import { Module } from '@nestjs/common';
import { PatternsModule } from './domain/patterns/patterns.module';
import { PubSubModule } from './pubsub.module';
import { RolesModule } from './domain/roles/roles.module';
import { SeederModule } from './seeder/seeder.module';
import { SettingsModule } from './settings/settings.module';
import { TownsModule } from './domain/towns/towns.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAnnotationsModule } from './domain/user-annotations/user-annotations.module';
import { UsersModule } from './domain/users/users.module';
import SettingsService from './settings/settings.service';
import { UserCeaseCausesModule } from './domain/user-cease-causes/user-cease-causes.module';
import { DocumentsModule } from './domain/documents/documents.module';

@Module({
  imports: [
    AnnotationsModule,
    AuthModule,
    CatsModule,
    CeaseCausesModule,
    ColoniesModule,
    ColonyAnnotationsModule,
    ColorsModule,
    DocumentsModule,
    EnvironmentsModule,
    EyeColorsModule,
    FileUploadModule,
    LocationTypesModule,
    PatternsModule,
    PubSubModule,
    RolesModule,
    SeederModule,
    SettingsModule,
    TownsModule,
    UserAnnotationsModule,
    UserCeaseCausesModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [SettingsModule],
      inject: [SettingsService],
      useFactory: async (settings: SettingsService) => settings.orm,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      include: [
        AnnotationsModule,
        AuthModule,
        CatsModule,
        CeaseCausesModule,
        ColoniesModule,
        ColonyAnnotationsModule,
        ColorsModule,
        DocumentsModule,
        EnvironmentsModule,
        EyeColorsModule,
        LocationTypesModule,
        PatternsModule,
        RolesModule,
        TownsModule,
        UserAnnotationsModule,
        UserCeaseCausesModule,
        UsersModule,
      ],
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
    }),
  ],
})
export class AppModule {}
