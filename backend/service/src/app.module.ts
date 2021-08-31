import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { ColoniesModule } from './colonies/colonies.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { PubSubModule } from './pubsub.module';
import { SeederModule } from './seeder/seeder.module';
import { TownsModule } from './towns/towns.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import appConfig from './config/configuration';

@Module({
  imports: [
    CatsModule,
    ColoniesModule,
    UsersModule,
    ConfigModule.forRoot({ ignoreEnvFile: true, isGlobal: true, load: [appConfig] }),
    GraphQLModule.forRoot({
      include: [CatsModule, ColoniesModule, UsersModule],
      debug: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
    }),
    PubSubModule,
    SeederModule,
    TownsModule,
    TypeOrmModule.forRoot(appConfig().orm),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
