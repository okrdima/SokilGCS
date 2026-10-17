import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { io, Socket as ClientSocket } from 'socket.io-client';
import { AppModule } from '../app.module';
import { SessionService } from './session.service';

describe('Telemetry WebSocket Gateway (e2e)', () => {
  let app: INestApplication;
  let port: number;
  let sessionService: SessionService;
  const originalEnv = process.env;

  beforeAll(async () => {
    process.env = {
      ...originalEnv,
      SIMULATOR_ENABLED: 'true',
      SIMULATOR_SEED: '42',
      WEB_ORIGIN: 'http://localhost:3000',
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.listen(0);

    const address = app.getHttpServer().address();
    port = typeof address === 'string' ? 3001 : (address?.port ?? 3001);

    sessionService = app.get(SessionService);
  });

  afterAll(async () => {
    await app.close();
    process.env = originalEnv;
  });

  it('receives events in order: session -> snapshot -> batch on connect (AC-1)', (done) => {
    const client: ClientSocket = io(`http://localhost:${port}`, {
      transports: ['websocket'],
    });

    const receivedOrder: string[] = [];

    client.on('session', (sessionData) => {
      receivedOrder.push('session');
      expect(sessionData).toBeDefined();
      expect(sessionData.id).toBeDefined();
    });

    client.on('snapshot', (snapshotData) => {
      receivedOrder.push('snapshot');
      expect(snapshotData).toBeDefined();
      expect(Array.isArray(snapshotData.samples)).toBe(true);
    });

    client.on('batch', (batchData) => {
      receivedOrder.push('batch');
      expect(batchData).toBeDefined();
      expect(batchData.samples.length).toBeGreaterThan(0);

      expect(receivedOrder.slice(0, 3)).toEqual(['session', 'snapshot', 'batch']);
      client.disconnect();
      done();
    });
  }, 10000);

  it('receives approximately 20 (±4) batches over 2 seconds', (done) => {
    const client: ClientSocket = io(`http://localhost:${port}`, {
      transports: ['websocket'],
    });

    let batchCount = 0;
    client.on('batch', () => {
      batchCount++;
    });

    setTimeout(() => {
      client.disconnect();
      // At 10 Hz, 2 seconds yields ~20 batches. Allow network/CI tolerance: [16, 24]
      expect(batchCount).toBeGreaterThanOrEqual(16);
      expect(batchCount).toBeLessThanOrEqual(24);
      done();
    }, 2050);
  }, 10000);

  it('receives snapshot containing all 9 channels after data has accumulated (AC-4)', (done) => {
    // Wait 1.1s for tick 10 to emit so all 9 channels have been emitted at least once
    setTimeout(() => {
      const client: ClientSocket = io(`http://localhost:${port}`, {
        transports: ['websocket'],
      });

      client.on('snapshot', (snapshotData) => {
        const channelIds = snapshotData.samples.map((s: { channelId: string }) => s.channelId);
        expect(new Set(channelIds).size).toBe(9);
        client.disconnect();
        done();
      });
    }, 1100);
  }, 10000);

  it('emits session with null and NO snapshot when no active session exists', (done) => {
    // Temporarily clear active session
    const active = sessionService.getActive();
    (sessionService as any).activeSession = null;

    const client: ClientSocket = io(`http://localhost:${port}`, {
      transports: ['websocket'],
      forceNew: true,
    });

    let snapshotReceived = false;
    client.on('snapshot', () => {
      snapshotReceived = true;
    });

    client.on('session', (sessionData) => {
      expect(sessionData).toBeNull();

      setTimeout(() => {
        expect(snapshotReceived).toBe(false);
        // Restore active session
        (sessionService as any).activeSession = active;
        client.disconnect();
        done();
      }, 300);
    });
  }, 10000);
});
