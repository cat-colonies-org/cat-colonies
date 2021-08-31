import { Module } from '@nestjs/common';
import { EyeColorsService } from './eye-colors.service';
import { EyeColorsResolver } from './eye-colors.resolver';
import { EyeColor } from './entities/eye-color.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EyeColor])],
  providers: [EyeColorsResolver, EyeColorsService],
})
export class EyeColorsModule {}
