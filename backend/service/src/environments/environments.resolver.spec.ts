import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentsResolver } from './environments.resolver';
import { EnvironmentsService } from './environments.service';

describe('EnvironmentsResolver', () => {
  let resolver: EnvironmentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvironmentsResolver, EnvironmentsService],
    }).compile();

    resolver = module.get<EnvironmentsResolver>(EnvironmentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
