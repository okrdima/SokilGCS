import { describe, expect, it } from 'vitest';
import { FlightEventSchema } from '../../src/events/dto/flight-event.dto';
import { TelemetryFrameSchema } from '../../src/telemetry/types/telemetry-frame.type';

describe('FlightEventSchema', () => {
  const validTelemetry = TelemetryFrameSchema.parse({
    timestamp: 1672531200000,
    droneId: 'drone-123',
    attitude: { orientation: { roll: 0, pitch: 0, yaw: 0 } },
    battery: { percentage: 0.5, voltage: 12 },
    position: {
      point: { lat: 45, lon: -75, alt: 0 },
      velocity: { x: 0, y: 0, z: 0 }
    },
    radio: { rssi: -50 },
    missionId: 'mission-456',
  });

  const validEvent = {
    eventType: 'TAKEOFF' as const,
    timestamp: 1672531200000,
    telemetry: validTelemetry
  };

  it('should validate a correct flight event', () => {
    expect(FlightEventSchema.parse(validEvent)).toEqual(validEvent);
  });

  it('should fail if eventType is invalid', () => {
    const invalid = { ...validEvent, eventType: 'FLYING' as any };
    expect(() => FlightEventSchema.parse(invalid)).toThrow();
  });

  it('should fail if telemetry is missing', () => {
    const { telemetry, ...invalid } = validEvent as any;
    expect(() => FlightEventSchema.parse(invalid)).toThrow();
  });
});
