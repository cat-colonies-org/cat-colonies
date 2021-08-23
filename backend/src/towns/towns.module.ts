import { Module } from '@nestjs/common';
import { TownsService } from './towns.service';
import { TownsResolver } from './towns.resolver';

@Module({
  providers: [TownsResolver, TownsService]
})
export class TownsModule {}
