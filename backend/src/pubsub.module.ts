import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Global, Module } from '@nestjs/common';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useFactory: () =>
        new RedisPubSub({
          connection: {
            host: 'redis', // TODO: move to config
            port: 6379,
          },
        }),
    },
  ],
  exports: [PUB_SUB],
})
export class PubSubModule {}
