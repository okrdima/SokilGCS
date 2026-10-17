import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionService } from './telemetry/session.service';

describe('AppController', () => {
  let appController: AppController;
  let mockSessionService: { getActive: jest.Mock };

  beforeEach(async () => {
    mockSessionService = {
      getActive: jest.fn().mockReturnValue(null),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('health', () => {
    it('returns stopped status when no active simulator session exists', () => {
      expect(appController.getHealth()).toEqual({
        status: 'ok',
        simulator: 'stopped',
      });
    });

    it('returns running status when simulator session is active', () => {
      mockSessionService.getActive.mockReturnValue({
        sourceKind: 'SIMULATOR',
      });
      expect(appController.getHealth()).toEqual({
        status: 'ok',
        simulator: 'running',
      });
    });
  });
});
