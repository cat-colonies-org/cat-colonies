import { Test, TestingModule } from '@nestjs/testing';
import { ColoniesResolver } from './colonies.resolver';
import { ColoniesService } from './colonies.service';

describe('ColoniesResolver', () => {
  let resolver: ColoniesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColoniesResolver, ColoniesService],
    }).compile();

    resolver = module.get<ColoniesResolver>(ColoniesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
