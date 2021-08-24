import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { ColoniesModule } from './colonies/colonies.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { PubSubModule } from './pubsub.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TownsModule } from './towns/towns.module';
import { UsersModule } from './users/users.module';
import appConfig from './config/configuration';
import ormConfig from '../ormconfig';

@Module({
  imports: [
    CatsModule,
    ColoniesModule,
    ConfigModule.forRoot({ ignoreEnvFile: true, isGlobal: true, load: [appConfig] }),
    PubSubModule,
    TypeOrmModule.forRoot(ormConfig),
    GraphQLModule.forRoot({
      include: [CatsModule, ColoniesModule],
      debug: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
    }),
    TownsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
