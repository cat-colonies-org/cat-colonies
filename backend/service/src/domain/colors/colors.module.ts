import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorsResolver } from './colors.resolver';
import { ColorsService } from './colors.service';
import { Color } from './entities/color.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Color])],
  providers: [ColorsResolver, ColorsService],
})
export class ColorsModule {}
