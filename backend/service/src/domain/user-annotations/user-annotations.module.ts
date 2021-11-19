import { Module } from '@nestjs/common';
import { UserAnnotationsService } from './user-annotations.service';
import { UserAnnotationsResolver } from './user-annotations.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAnnotation } from './entities/user-annotation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAnnotation])],
  providers: [UserAnnotationsResolver, UserAnnotationsService],
})
export class UserAnnotationsModule {}
