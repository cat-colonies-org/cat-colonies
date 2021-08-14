import { Test, TestingModule } from '@nestjs/testing';
import { ColoniesService } from './colonies.service';

describe('ColoniesService', () => {
  let service: ColoniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColoniesService],
    }).compile();

    service = module.get<ColoniesService>(ColoniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
