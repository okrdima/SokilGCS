import { Test, TestingModule } from '@nestjs/testing';
import { DroneController } from './drone.controller';
import { DroneService } from './drone.service';

describe('DroneController', () => {
  let controller: DroneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DroneController],
      providers: [
        {
          provide: DroneService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DroneController>(DroneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
