import { Module } from '@nestjs/common';
import { CeaseCausesService } from './cease-causes.service';
import { CeaseCausesResolver } from './cease-causes.resolver';
import { CeaseCause } from './entities/cease-cause.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CeaseCause])],
  providers: [CeaseCausesResolver, CeaseCausesService],
})
export class CeaseCausesModule {}
