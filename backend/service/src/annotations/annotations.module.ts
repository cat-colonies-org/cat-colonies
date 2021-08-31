import { Module } from '@nestjs/common';
import { AnnotationsService } from './annotations.service';
import { AnnotationsResolver } from './annotations.resolver';

@Module({
  providers: [AnnotationsResolver, AnnotationsService]
})
export class AnnotationsModule {}
