import { Module } from '@nestjs/common';
import { PatternsService } from './patterns.service';
import { PatternsResolver } from './patterns.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pattern } from './entities/pattern.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pattern])],
  providers: [PatternsResolver, PatternsService],
})
export class PatternsModule {}
