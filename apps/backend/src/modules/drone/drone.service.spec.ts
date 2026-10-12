import { Test, TestingModule } from '@nestjs/testing';
import { DroneService } from './drone.service';

describe('DroneService', () => {
  let service: DroneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DroneService],
    }).compile();

    service = module.get<DroneService>(DroneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
