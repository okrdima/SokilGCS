import { ChannelDefinition, ChannelDefinitionSchema } from '@sokil/contracts';

const RAW_CHANNELS = [
  {
    id: 'position.lat',
    name: 'Latitude',
    valueType: 'NUMBER' as const,
    unit: 'deg',
    nominalRateHz: 10,
  },
  {
    id: 'position.lon',
    name: 'Longitude',
    valueType: 'NUMBER' as const,
    unit: 'deg',
    nominalRateHz: 10,
  },
  {
    id: 'nav.groundspeed',
    name: 'Ground speed',
    valueType: 'NUMBER' as const,
    unit: 'm/s',
    nominalRateHz: 10,
    limits: {
      yellowHigh: 5.0,
      redHigh: 6.0,
    },
  },
  {
    id: 'nav.heading',
    name: 'Heading',
    valueType: 'NUMBER' as const,
    unit: 'deg',
    nominalRateHz: 10,
  },
  {
    id: 'battery.voltage',
    name: 'Battery voltage',
    valueType: 'NUMBER' as const,
    unit: 'V',
    nominalRateHz: 10,
    limits: {
      redLow: 21.2,
      yellowLow: 21.8,
      yellowHigh: 25.2,
      redHigh: 25.8,
    },
  },
  {
    id: 'battery.current',
    name: 'Battery current',
    valueType: 'NUMBER' as const,
    unit: 'A',
    nominalRateHz: 10,
  },
  {
    id: 'gps.satellites',
    name: 'GPS satellites',
    valueType: 'NUMBER' as const,
    unit: 'count',
    nominalRateHz: 1,
    limits: {
      redLow: 6,
      yellowLow: 10,
    },
  },
  {
    id: 'gps.hdop',
    name: 'GPS HDOP',
    valueType: 'NUMBER' as const,
    unit: 'none',
    nominalRateHz: 5,
    limits: {
      yellowHigh: 1.8,
      redHigh: 2.5,
    },
  },
  {
    id: 'link.rssi',
    name: 'Link RSSI',
    valueType: 'NUMBER' as const,
    unit: 'dBm',
    nominalRateHz: 2,
    limits: {
      redLow: -95,
      yellowLow: -85,
    },
  },
];

// Validate at module load — invalid entry fails startup
export const SIMULATOR_CHANNELS: ChannelDefinition[] = RAW_CHANNELS.map((ch) =>
  ChannelDefinitionSchema.parse(ch),
);
