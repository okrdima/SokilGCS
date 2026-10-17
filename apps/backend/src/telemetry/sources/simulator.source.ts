import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import type { Session, TelemetryBatch } from '@sokil/contracts';
import { validateEnv } from '../../config/env';
import { createVehicleModel, VehicleModel } from '../../domain/simulator';
import { IngestService } from '../ingest.service';
import { SessionService } from '../session.service';
import type { TelemetrySource } from './telemetry-source';

@Injectable()
export class SimulatorSource
  implements TelemetrySource, OnModuleInit, OnModuleDestroy
{
  readonly id = 'simulator';
  private readonly logger = new Logger(SimulatorSource.name);

  private model: VehicleModel | null = null;
  private session: Session | null = null;
  private running = false;
  private timeoutId: NodeJS.Timeout | null = null;
  private tickIndex = 0;
  private startMs = 0;
  private batchCount = 0;
  private lastLogTime = 0;

  constructor(
    private readonly ingestService: IngestService,
    private readonly sessionService: SessionService,
  ) {}

  onModuleInit(): void {
    const env = validateEnv();

    if (!env.SIMULATOR_ENABLED) {
      this.logger.log('Simulator is disabled via SIMULATOR_ENABLED=false');
      return;
    }

    this.session = this.sessionService.createSimulatorSession();
    this.model = createVehicleModel({
      seed: env.SIMULATOR_SEED,
      batteryDrainSeconds: env.SIMULATOR_BATTERY_DRAIN_SECONDS,
    });

    this.logger.log(
      `Starting simulator session ${this.session.id} (seed=${env.SIMULATOR_SEED}, batteryDrain=${env.SIMULATOR_BATTERY_DRAIN_SECONDS}s)`,
    );

    this.start();
  }

  start(): void {
    if (this.running || !this.model || !this.session) {
      return;
    }

    this.running = true;
    this.startMs = Date.now();
    this.tickIndex = 0;
    this.batchCount = 0;
    this.lastLogTime = this.startMs;

    this.scheduleNextTick();
  }

  stop(): void {
    this.running = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  onModuleDestroy(): void {
    this.stop();
  }

  private scheduleNextTick(): void {
    if (!this.running || !this.model || !this.session) {
      return;
    }

    const scheduledTime = this.startMs + this.tickIndex * 100;
    const now = Date.now();
    const delay = Math.max(0, scheduledTime - now);

    this.timeoutId = setTimeout(() => {
      if (!this.running || !this.model || !this.session) {
        return;
      }

      const samples = this.model.samplesAt(this.tickIndex, scheduledTime);
      const batch: TelemetryBatch = {
        sessionId: this.session.id,
        sourceId: this.id,
        samples,
      };

      this.ingestService.ingest(batch);
      this.batchCount++;
      this.tickIndex++;

      const nowAfter = Date.now();
      if (nowAfter - this.lastLogTime >= 10000) {
        const elapsedSec = (nowAfter - this.lastLogTime) / 1000;
        const rate = (this.batchCount / elapsedSec).toFixed(1);
        this.logger.debug(
          `Simulator emitting ${rate} batches/s (${this.batchCount} batches in ${elapsedSec.toFixed(1)}s)`,
        );
        this.batchCount = 0;
        this.lastLogTime = nowAfter;
      }

      this.scheduleNextTick();
    }, delay);
  }
}
