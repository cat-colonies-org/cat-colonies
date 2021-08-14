import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsModule } from './cats/cats.module';
import { ColoniesModule } from './colonies/colonies.module';
import config from '../ormconfig';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    GraphQLModule.forRoot({
      include: [CatsModule, ColoniesModule],
      debug: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),

    CatsModule,
    ColoniesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
