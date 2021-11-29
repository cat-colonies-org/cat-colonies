import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColonyAnnotationsResolver } from './colony-annotations.resolver';
import { ColonyAnnotationsService } from './colony-annotations.service';
import { ColonyAnnotation } from './entities/colony-annotation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ColonyAnnotation])],
  providers: [ColonyAnnotationsResolver, ColonyAnnotationsService],
})
export class ColonyAnnotationsModule {}
