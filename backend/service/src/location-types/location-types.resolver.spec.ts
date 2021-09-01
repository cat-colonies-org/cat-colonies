import { Test, TestingModule } from '@nestjs/testing';
import { LocationTypesResolver } from './location-types.resolver';
import { LocationTypesService } from './location-types.service';

describe('LocationTypesResolver', () => {
  let resolver: LocationTypesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationTypesResolver, LocationTypesService],
    }).compile();

    resolver = module.get<LocationTypesResolver>(LocationTypesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
