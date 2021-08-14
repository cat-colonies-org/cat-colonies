import { Module } from '@nestjs/common';
import { ColoniesService } from './colonies.service';
import { ColoniesResolver } from './colonies.resolver';

@Module({
  providers: [ColoniesResolver, ColoniesService]
})
export class ColoniesModule {}
