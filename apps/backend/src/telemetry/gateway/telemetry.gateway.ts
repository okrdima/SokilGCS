import {
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Subscription } from 'rxjs';
import { IngestService } from '../ingest.service';
import { LatestValueStore } from '../latest-values.store';
import { SessionService } from '../session.service';

@WebSocketGateway({
  cors: {
    origin: process.env.WEB_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
export class TelemetryGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(TelemetryGateway.name);
  private batchesSub: Subscription | null = null;

  constructor(
    private readonly sessionService: SessionService,
    private readonly store: LatestValueStore,
    private readonly ingestService: IngestService,
  ) {}

  afterInit(): void {
    this.logger.log('Telemetry WebSocket Gateway initialized');

    this.batchesSub = this.ingestService.batches$.subscribe((batch) => {
      if (!this.server) return;
      // Emit volatile batch to the session room (drops packet if client buffer is full)
      this.server
        .to(`session:${batch.sessionId}`)
        .volatile.emit('batch', batch);
    });
  }

  handleConnection(client: Socket): void {
    const activeSession = this.sessionService.getActive();

    if (!activeSession) {
      this.logger.log(`Client ${client.id} connected, but no active session`);
      client.emit('session', null);
      return;
    }

    this.logger.log(
      `Client ${client.id} connected to session ${activeSession.id}`,
    );

    // 1. Emit session to this client
    client.emit('session', activeSession);

    // 2. Emit snapshot of latest values to this client
    client.emit('snapshot', {
      sessionId: activeSession.id,
      samples: this.store.snapshot(),
    });

    // 3. Join client to the session room for live batch broadcasts
    void client.join(`session:${activeSession.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  onModuleDestroy(): void {
    if (this.batchesSub) {
      this.batchesSub.unsubscribe();
      this.batchesSub = null;
    }
  }
}
