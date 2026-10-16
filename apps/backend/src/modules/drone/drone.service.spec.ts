import { Test, TestingModule } from '@nestjs/testing';
import { DroneService } from './drone.service';

import { DroneRepository } from './repositories/drone.repository';

describe('DroneService', () => {
  let service: DroneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DroneService,
        {
          provide: DroneRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DroneService>(DroneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
