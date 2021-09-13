import { Module } from '@nestjs/common';
import { TownsService } from './towns.service';
import { TownsResolver } from './towns.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Town } from './entities/town.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Town])],
  providers: [TownsResolver, TownsService],
})
export class TownsModule {}
