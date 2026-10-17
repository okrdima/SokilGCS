import { offsetLatLon, haversineM, EARTH_RADIUS_M } from './geo';

describe('geo math utilities', () => {
  const KYIV = { lat: 50.4501, lon: 30.5234 };

  it('offsets 1000 m north with haversine distance approx 1000 m', () => {
    const moved = offsetLatLon(KYIV.lat, KYIV.lon, 0, 1000);
    const distance = haversineM(KYIV, moved);
    expect(distance).toBeCloseTo(1000, 1);
  });

  it('offsets 1000 m east with haversine distance approx 1000 m', () => {
    const moved = offsetLatLon(KYIV.lat, KYIV.lon, 1000, 0);
    const distance = haversineM(KYIV, moved);
    expect(distance).toBeCloseTo(1000, 1);
  });

  it('performs round-trip offset and returns to origin', () => {
    const step1 = offsetLatLon(KYIV.lat, KYIV.lon, 500, 500);
    const step2 = offsetLatLon(step1.lat, step1.lon, -500, -500);
    const distance = haversineM(KYIV, step2);
    expect(distance).toBeLessThan(0.1); // Within 10 cm on a curved sphere
  });

  it('verifies longitude degrees for fixed distance shrink at higher latitudes (cos(lat))', () => {
    const equator = { lat: 0, lon: 0 };
    const arctic = { lat: 60, lon: 0 };

    const offsetEq = offsetLatLon(equator.lat, equator.lon, 10000, 0);
    const offsetArc = offsetLatLon(arctic.lat, arctic.lon, 10000, 0);

    const dLonEq = offsetEq.lon - equator.lon;
    const dLonArc = offsetArc.lon - arctic.lon;

    // At 60 deg, cos(60) = 0.5, so dLonArc should be ~2x dLonEq
    expect(dLonArc / dLonEq).toBeCloseTo(2, 2);
  });

  it('exports EARTH_RADIUS_M constant', () => {
    expect(EARTH_RADIUS_M).toBe(6_371_008.8);
  });
});
