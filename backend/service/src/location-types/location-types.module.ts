import { Module } from '@nestjs/common';
import { LocationTypesService } from './location-types.service';
import { LocationTypesResolver } from './location-types.resolver';
import { LocationType } from './entities/location-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LocationType])],
  providers: [LocationTypesResolver, LocationTypesService],
})
export class LocationTypesModule {}
