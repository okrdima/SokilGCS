export interface TelemetryFrame {
  timestamp: number;
  values: Record<string, number>;
}
