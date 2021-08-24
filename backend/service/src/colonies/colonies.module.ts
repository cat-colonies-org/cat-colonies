import { Module } from '@nestjs/common';
import { ColoniesService } from './colonies.service';
import { ColoniesResolver } from './colonies.resolver';
import { Colony } from './entities/colony.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Colony])],
  providers: [ColoniesResolver, ColoniesService],
})
export class ColoniesModule {}
