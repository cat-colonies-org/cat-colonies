import { Module } from '@nestjs/common';
import { PatternsService } from './patterns.service';
import { PatternsResolver } from './patterns.resolver';

@Module({
  providers: [PatternsResolver, PatternsService]
})
export class PatternsModule {}
