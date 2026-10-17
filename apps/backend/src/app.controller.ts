import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SessionService } from './telemetry/session.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly sessionService: SessionService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): { status: string; simulator: 'running' | 'stopped' } {
    const active = this.sessionService.getActive();
    const isSimulatorRunning = active?.sourceKind === 'SIMULATOR';
    return {
      status: 'ok',
      simulator: isSimulatorRunning ? 'running' : 'stopped',
    };
  }
}
