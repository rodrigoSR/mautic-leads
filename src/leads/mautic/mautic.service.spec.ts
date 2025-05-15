import { Test, TestingModule } from '@nestjs/testing';
import { MauticService } from './mautic.service';

describe('MauticService', () => {
  let service: MauticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MauticService],
    }).compile();

    service = module.get<MauticService>(MauticService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
