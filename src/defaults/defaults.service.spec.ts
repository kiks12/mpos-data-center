import { Test, TestingModule } from '@nestjs/testing';
import { DefaultsService } from './defaults.service';

describe('DefaultsService', () => {
  let service: DefaultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DefaultsService],
    }).compile();

    service = module.get<DefaultsService>(DefaultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
