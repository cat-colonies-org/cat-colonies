import { Module } from '@nestjs/common';
import { Picture } from './entities/picture.entity';
import { PicturesService } from './pictures.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Picture])],
  providers: [PicturesService],
  exports: [PicturesService],
})
export class PicturesModule {}
