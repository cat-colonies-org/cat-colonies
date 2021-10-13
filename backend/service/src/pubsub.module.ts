import { Global, Module } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { SettingsModule } from './settings/settings.module';
import SettingsService from './settings/settings.service';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
  imports: [SettingsModule],
  providers: [
    {
      provide: PUB_SUB,
      inject: [SettingsService],
      useFactory: (settings: SettingsService) =>
        new RedisPubSub({
          connection: {
            host: settings.redis.host,
            port: settings.redis.port,
          },
        }),
    },
  ],
  exports: [PUB_SUB],
})
export class PubSubModule {}
