export interface TelemetryLogIndex {
  /**
   * Flight identifier.
   */
  flightId: string;
  /**
   * Start and end timestamps.
   */
  startTime: number;
  endTime: number;
  /**
   * Path to the binary telemetry log.
   */
  logPath: string;
}
