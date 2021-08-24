import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new RedisPubSub({
          connection: {
            host: config.get<string>('redis.host'),
            port: config.get<number>('redis.port'),
          },
        }),
    },
  ],
  exports: [PUB_SUB],
})
export class PubSubModule {}
