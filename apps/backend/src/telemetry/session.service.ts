import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Session, SessionSchema } from '@sokil/contracts';
import { SIMULATOR_CHANNELS } from './channels';

@Injectable()
export class SessionService {
  private activeSession: Session | null = null;

  getActive(): Session | null {
    return this.activeSession;
  }

  createSimulatorSession(): Session {
    const now = Date.now();
    const iso = new Date(now).toISOString();

    const sessionData = {
      id: randomUUID(),
      name: `Simulator run ${iso}`,
      sourceKind: 'SIMULATOR' as const,
      vehicleKind: 'ROVER' as const,
      startedAt: now,
      channels: SIMULATOR_CHANNELS,
    };

    const session = SessionSchema.parse(sessionData);
    this.activeSession = session;
    return session;
  }
}
