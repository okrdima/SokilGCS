export interface TelemetrySource {
  readonly id: string;
  start(): void;
  stop(): void;
}
