import { Module } from '@nestjs/common';
import { EnvironmentsService } from './environments.service';
import { EnvironmentsResolver } from './environments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment } from './entities/environment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Environment])],
  providers: [EnvironmentsResolver, EnvironmentsService],
})
export class EnvironmentsModule {}
