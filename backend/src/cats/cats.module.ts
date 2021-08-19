import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsResolver } from './cats.resolver';
import { Cat } from './entities/cat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsRepository } from './cats.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Cat])],
  providers: [CatsResolver, CatsService, CatsRepository],
})
export class CatsModule {}
