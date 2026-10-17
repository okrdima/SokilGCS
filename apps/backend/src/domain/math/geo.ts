export const EARTH_RADIUS_M = 6_371_008.8;

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

export interface LatLon {
  lat: number;
  lon: number;
}

/**
 * Offsets a latitude/longitude pair by east and north distances in meters.
 * Uses spherical Earth with radius 6,371,008.8m and cosine scaling for longitude.
 */
export function offsetLatLon(
  lat0: number,
  lon0: number,
  eastM: number,
  northM: number,
): LatLon {
  const dLatDeg = (northM / EARTH_RADIUS_M) * RAD_TO_DEG;
  const lat0Rad = lat0 * DEG_TO_RAD;
  const cosLat = Math.cos(lat0Rad);
  const dLonDeg = (eastM / (EARTH_RADIUS_M * cosLat)) * RAD_TO_DEG;

  return {
    lat: lat0 + dLatDeg,
    lon: lon0 + dLonDeg,
  };
}

/**
 * Computes great-circle distance between two points in meters using the Haversine formula.
 */
export function haversineM(a: LatLon, b: LatLon): number {
  const lat1 = a.lat * DEG_TO_RAD;
  const lat2 = b.lat * DEG_TO_RAD;
  const dLat = (b.lat - a.lat) * DEG_TO_RAD;
  const dLon = (b.lon - a.lon) * DEG_TO_RAD;

  const sinHalfDLat = Math.sin(dLat / 2);
  const sinHalfDLon = Math.sin(dLon / 2);

  const h =
    sinHalfDLat * sinHalfDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinHalfDLon * sinHalfDLon;

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
  return EARTH_RADIUS_M * c;
}
