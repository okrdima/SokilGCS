import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { json } from 'express';
import { AppModule } from '../app.module';
import { SessionService } from './session.service';
import { Session } from '@sokil/contracts';

describe('Ingest HTTP Endpoint (e2e)', () => {
  let app: INestApplication;
  let sessionService: SessionService;
  let activeSession: Session;
  const originalEnv = process.env;
  const TEST_TOKEN = 'test-secret-token-123';

  beforeAll(async () => {
    process.env = {
      ...originalEnv,
      SIMULATOR_ENABLED: 'false',
      INGEST_TOKEN: TEST_TOKEN,
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(json({ limit: '1mb' }));
    await app.init();

    sessionService = app.get(SessionService);
    activeSession = sessionService.createSimulatorSession();
  });

  afterAll(async () => {
    await app.close();
    process.env = originalEnv;
  });

  it('202: accepts valid batch with correct token', async () => {
    const validBatch = {
      sessionId: activeSession.id,
      sourceId: 'http-agent',
      samples: [
        {
          channelId: 'battery.voltage',
          t: Date.now(),
          value: 24.5,
        },
        {
          channelId: 'position.lat',
          t: Date.now(),
          value: 50.45,
        },
      ],
    };

    const res = await request(app.getHttpServer())
      .post('/ingest/batch')
      .set('x-api-key', TEST_TOKEN)
      .send(validBatch)
      .expect(202);

    expect(res.body).toEqual({ accepted: 2 });
  });

  it('400: rejects batch missing required fields with error list', async () => {
    const res = await request(app.getHttpServer())
      .post('/ingest/batch')
      .set('x-api-key', TEST_TOKEN)
      .send({})
      .expect(400);

    expect(res.body).toHaveProperty('errors');
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('401: rejects request with missing token header', async () => {
    const validBatch = {
      sessionId: activeSession.id,
      sourceId: 'http-agent',
      samples: [{ channelId: 'battery.voltage', t: Date.now(), value: 24.5 }],
    };

    await request(app.getHttpServer())
      .post('/ingest/batch')
      .send(validBatch)
      .expect(401);
  });

  it('401: rejects request with wrong token', async () => {
    const validBatch = {
      sessionId: activeSession.id,
      sourceId: 'http-agent',
      samples: [{ channelId: 'battery.voltage', t: Date.now(), value: 24.5 }],
    };

    await request(app.getHttpServer())
      .post('/ingest/batch')
      .set('x-api-key', 'completely-wrong-token')
      .send(validBatch)
      .expect(401);
  });

  it('404: rejects batch with unknown or non-active sessionId', async () => {
    const unknownBatch = {
      sessionId: 'a0000000-0000-4000-8000-000000000000',
      sourceId: 'http-agent',
      samples: [{ channelId: 'battery.voltage', t: Date.now(), value: 24.5 }],
    };

    await request(app.getHttpServer())
      .post('/ingest/batch')
      .set('x-api-key', TEST_TOKEN)
      .send(unknownBatch)
      .expect(404);
  });

  it('422: rejects batch with unknown channelId', async () => {
    const invalidChannelBatch = {
      sessionId: activeSession.id,
      sourceId: 'http-agent',
      samples: [{ channelId: 'unknown.channel', t: Date.now(), value: 123 }],
    };

    await request(app.getHttpServer())
      .post('/ingest/batch')
      .set('x-api-key', TEST_TOKEN)
      .send(invalidChannelBatch)
      .expect(422);
  });

  it('422: rejects batch with wrong valueType for known channel', async () => {
    const invalidTypeBatch = {
      sessionId: activeSession.id,
      sourceId: 'http-agent',
      samples: [{ channelId: 'battery.voltage', t: Date.now(), value: 'not-a-number' }],
    };

    await request(app.getHttpServer())
      .post('/ingest/batch')
      .set('x-api-key', TEST_TOKEN)
      .send(invalidTypeBatch)
      .expect(422);
  });

  it('413: rejects request when payload exceeds 1 MB', async () => {
    // Large payload > 1 MB
    const largeString = 'x'.repeat(1.2 * 1024 * 1024);

    await request(app.getHttpServer())
      .post('/ingest/batch')
      .set('x-api-key', TEST_TOKEN)
      .set('Content-Type', 'application/json')
      .send(`{"data":"${largeString}"}`)
      .expect(413);
  });

  it('503: returns 503 when INGEST_TOKEN is not configured', async () => {
    delete process.env.INGEST_TOKEN;

    const validBatch = {
      sessionId: activeSession.id,
      sourceId: 'http-agent',
      samples: [{ channelId: 'battery.voltage', t: Date.now(), value: 24.5 }],
    };

    await request(app.getHttpServer())
      .post('/ingest/batch')
      .set('x-api-key', TEST_TOKEN)
      .send(validBatch)
      .expect(503);

    // Restore for other tests
    process.env.INGEST_TOKEN = TEST_TOKEN;
  });
});
