import { Test, TestingModule } from '@nestjs/testing';
import { LocationTypesService } from './location-types.service';

describe('LocationTypesService', () => {
  let service: LocationTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationTypesService],
    }).compile();

    service = module.get<LocationTypesService>(LocationTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
