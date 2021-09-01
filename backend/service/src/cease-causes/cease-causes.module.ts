import { Module } from '@nestjs/common';
import { CeaseCausesService } from './cease-causes.service';
import { CeaseCausesResolver } from './cease-causes.resolver';

@Module({
  providers: [CeaseCausesResolver, CeaseCausesService]
})
export class CeaseCausesModule {}
