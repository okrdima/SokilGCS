import { Controller, Get, NotFoundException } from '@nestjs/common';
import { SessionService } from './session.service';
import type { Session } from '@sokil/contracts';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('active')
  getActive(): Session {
    const session = this.sessionService.getActive();
    if (!session) {
      throw new NotFoundException('No active session found');
    }
    return session;
  }
}
