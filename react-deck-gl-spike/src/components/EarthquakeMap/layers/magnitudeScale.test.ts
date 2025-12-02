import { describe, it, expect } from 'vitest';
import {
  magnitudeToRadius,
  magnitudeToRadiusPower,
  createRadiusBuffer,
} from './magnitudeScale';
import type { Earthquake } from '../../../types/earthquake';

describe('magnitudeToRadius', () => {
  it('returns larger radius for larger magnitudes', () => {
    const radius4 = magnitudeToRadius(4);
    const radius5 = magnitudeToRadius(5);
    const radius6 = magnitudeToRadius(6);

    expect(radius5).toBeGreaterThan(radius4);
    expect(radius6).toBeGreaterThan(radius5);
  });

  it('uses exponential scaling (magnitude 5 should be ~2x magnitude 4)', () => {
    const radius4 = magnitudeToRadius(4);
    const radius5 = magnitudeToRadius(5);

    expect(radius5 / radius4).toBeCloseTo(2);
  });

  it('handles magnitude below threshold (returns base size)', () => {
    const radius0 = magnitudeToRadius(0);
    const radius1 = magnitudeToRadius(1);
    const radius2 = magnitudeToRadius(2);

    // All below threshold should return base size (1000)
    expect(radius0).toBe(1000);
    expect(radius1).toBe(1000);
    expect(radius2).toBe(1000);
  });

  it('handles negative magnitude', () => {
    const radiusNegative = magnitudeToRadius(-1);

    // Should return base size
    expect(radiusNegative).toBe(1000);
  });

  it('handles very large magnitudes', () => {
    const radius9 = magnitudeToRadius(9);
    const radius10 = magnitudeToRadius(10);

    expect(radius9).toBeGreaterThan(0);
    expect(radius10).toBeGreaterThan(radius9);
    expect(radius10 / radius9).toBeCloseTo(2);
  });

  it('returns expected values for common magnitudes', () => {
    // Base size = 1000, scaling starts at magnitude 2
    expect(magnitudeToRadius(2)).toBe(1000); // 1000 * 2^0
    expect(magnitudeToRadius(3)).toBe(2000); // 1000 * 2^1
    expect(magnitudeToRadius(4)).toBe(4000); // 1000 * 2^2
    expect(magnitudeToRadius(5)).toBe(8000); // 1000 * 2^3
    expect(magnitudeToRadius(6)).toBe(16000); // 1000 * 2^4
  });
});

describe('magnitudeToRadiusPower', () => {
  it('returns value within [minRadius, maxRadius] bounds', () => {
    const minRadius = 2000;
    const maxRadius = 200000;

    // Test various magnitudes
    for (let mag = 0; mag <= 10; mag++) {
      const radius = magnitudeToRadiusPower(mag);
      expect(radius).toBeGreaterThanOrEqual(minRadius);
      expect(radius).toBeLessThanOrEqual(maxRadius);
    }
  });

  it('returns minRadius for magnitudes at or below minimum', () => {
    expect(magnitudeToRadiusPower(0)).toBe(2000);
    expect(magnitudeToRadiusPower(1)).toBe(2000);
    expect(magnitudeToRadiusPower(2)).toBe(2000);
  });

  it('returns maxRadius for magnitudes at or above maximum', () => {
    expect(magnitudeToRadiusPower(9)).toBe(200000);
    expect(magnitudeToRadiusPower(10)).toBe(200000);
  });

  it('returns larger radius for larger magnitudes within range', () => {
    const radius3 = magnitudeToRadiusPower(3);
    const radius5 = magnitudeToRadiusPower(5);
    const radius7 = magnitudeToRadiusPower(7);

    expect(radius5).toBeGreaterThan(radius3);
    expect(radius7).toBeGreaterThan(radius5);
  });

  it('uses quadratic scaling (power of 2)', () => {
    // At midpoint (magnitude 5.5), the normalized value is 0.5
    // With power scale: 0.5^2 = 0.25
    // So radius should be 2000 + 0.25 * 198000 = 51500
    const radiusMid = magnitudeToRadiusPower(5.5);
    expect(radiusMid).toBeCloseTo(51500);
  });
});

describe('createRadiusBuffer', () => {
  const createEarthquake = (magnitude: number): Earthquake => ({
    id: `eq-${magnitude}`,
    longitude: 0,
    latitude: 0,
    depth: 10,
    magnitude,
    timestamp: '2024-01-01T00:00:00Z',
    location: 'Test Location',
  });

  it('returns Float32Array with correct length', () => {
    const earthquakes = [
      createEarthquake(4),
      createEarthquake(5),
      createEarthquake(6),
    ];

    const result = createRadiusBuffer(earthquakes);

    expect(result).toBeInstanceOf(Float32Array);
    expect(result.length).toBe(3);
  });

  it('values match magnitudeToRadius output', () => {
    const earthquakes = [
      createEarthquake(3),
      createEarthquake(5),
      createEarthquake(7),
    ];

    const result = createRadiusBuffer(earthquakes);

    expect(result[0]).toBeCloseTo(magnitudeToRadius(3));
    expect(result[1]).toBeCloseTo(magnitudeToRadius(5));
    expect(result[2]).toBeCloseTo(magnitudeToRadius(7));
  });

  it('handles empty array', () => {
    const result = createRadiusBuffer([]);

    expect(result).toBeInstanceOf(Float32Array);
    expect(result.length).toBe(0);
  });

  it('handles single earthquake', () => {
    const earthquakes = [createEarthquake(5)];

    const result = createRadiusBuffer(earthquakes);

    expect(result.length).toBe(1);
    expect(result[0]).toBeCloseTo(magnitudeToRadius(5));
  });

  it('preserves order of earthquakes', () => {
    const earthquakes = [
      createEarthquake(7),
      createEarthquake(3),
      createEarthquake(5),
    ];

    const result = createRadiusBuffer(earthquakes);

    expect(result[0]).toBeCloseTo(magnitudeToRadius(7));
    expect(result[1]).toBeCloseTo(magnitudeToRadius(3));
    expect(result[2]).toBeCloseTo(magnitudeToRadius(5));
  });
});
