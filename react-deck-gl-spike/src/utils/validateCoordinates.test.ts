import { describe, it, expect } from 'vitest';
import {
  isValidCoordinate,
  filterValidEarthquakes,
  normalizeCoordinates,
  createPositionBuffer,
} from './validateCoordinates';
import type { Earthquake } from '../types/earthquake';

describe('isValidCoordinate', () => {
  it('accepts valid coordinates', () => {
    expect(isValidCoordinate(-122.4194, 37.7749)).toBe(true); // San Francisco
    expect(isValidCoordinate(139.6917, 35.6895)).toBe(true); // Tokyo
    expect(isValidCoordinate(0, 0)).toBe(true); // Origin
    expect(isValidCoordinate(-180, -90)).toBe(true); // Min values
    expect(isValidCoordinate(180, 90)).toBe(true); // Max values
  });

  it('rejects longitude out of range', () => {
    expect(isValidCoordinate(181, 0)).toBe(false);
    expect(isValidCoordinate(-181, 0)).toBe(false);
    expect(isValidCoordinate(360, 0)).toBe(false);
  });

  it('rejects latitude out of range', () => {
    expect(isValidCoordinate(0, 91)).toBe(false);
    expect(isValidCoordinate(0, -91)).toBe(false);
    expect(isValidCoordinate(0, 180)).toBe(false);
  });

  it('rejects NaN values', () => {
    expect(isValidCoordinate(NaN, 0)).toBe(false);
    expect(isValidCoordinate(0, NaN)).toBe(false);
    expect(isValidCoordinate(NaN, NaN)).toBe(false);
  });

  it('rejects non-number types', () => {
    expect(isValidCoordinate('0' as unknown as number, 0)).toBe(false);
    expect(isValidCoordinate(0, '0' as unknown as number)).toBe(false);
    expect(isValidCoordinate(undefined as unknown as number, 0)).toBe(false);
    expect(isValidCoordinate(null as unknown as number, 0)).toBe(false);
  });
});

describe('filterValidEarthquakes', () => {
  const createEarthquake = (lng: number, lat: number): Earthquake => ({
    id: `eq-${lng}-${lat}`,
    longitude: lng,
    latitude: lat,
    depth: 10,
    magnitude: 5.0,
    timestamp: '2024-01-01T00:00:00Z',
    location: 'Test Location',
  });

  it('filters out earthquakes with invalid coordinates', () => {
    const earthquakes = [
      createEarthquake(-122.4, 37.8), // Valid
      createEarthquake(181, 0), // Invalid longitude
      createEarthquake(139.7, 35.7), // Valid
      createEarthquake(0, 91), // Invalid latitude
    ];

    const result = filterValidEarthquakes(earthquakes);

    expect(result).toHaveLength(2);
    expect(result[0].longitude).toBe(-122.4);
    expect(result[1].longitude).toBe(139.7);
  });

  it('keeps earthquakes with valid coordinates', () => {
    const earthquakes = [
      createEarthquake(-122.4, 37.8),
      createEarthquake(139.7, 35.7),
      createEarthquake(0, 0),
    ];

    const result = filterValidEarthquakes(earthquakes);

    expect(result).toHaveLength(3);
  });

  it('handles empty array', () => {
    const result = filterValidEarthquakes([]);

    expect(result).toEqual([]);
  });

  it('handles array with all invalid coordinates', () => {
    const earthquakes = [
      createEarthquake(181, 0),
      createEarthquake(0, 91),
      createEarthquake(NaN, NaN),
    ];

    const result = filterValidEarthquakes(earthquakes);

    expect(result).toEqual([]);
  });
});

describe('normalizeCoordinates', () => {
  const createEarthquake = (lng: number, lat: number): Earthquake => ({
    id: `eq-${lng}-${lat}`,
    longitude: lng,
    latitude: lat,
    depth: 10,
    magnitude: 5.0,
    timestamp: '2024-01-01T00:00:00Z',
    location: 'Test Location',
  });

  it('normalizes longitude values to [-180, 180]', () => {
    const earthquakes = [createEarthquake(200, 0)];

    const result = normalizeCoordinates(earthquakes);

    expect(result[0].longitude).toBe(-160);
  });

  it('handles antimeridian crossing (positive overflow)', () => {
    const earthquakes = [createEarthquake(190, 0)];

    const result = normalizeCoordinates(earthquakes);

    expect(result[0].longitude).toBe(-170);
  });

  it('handles antimeridian crossing (negative overflow)', () => {
    const earthquakes = [createEarthquake(-200, 0)];

    const result = normalizeCoordinates(earthquakes);

    expect(result[0].longitude).toBe(160);
  });

  it('preserves already normalized longitudes', () => {
    const earthquakes = [
      createEarthquake(-122.4, 37.8),
      createEarthquake(139.7, 35.7),
    ];

    const result = normalizeCoordinates(earthquakes);

    expect(result[0].longitude).toBeCloseTo(-122.4);
    expect(result[1].longitude).toBeCloseTo(139.7);
  });

  it('preserves other earthquake properties', () => {
    const earthquake = createEarthquake(200, 45);

    const result = normalizeCoordinates([earthquake]);

    expect(result[0].id).toBe(earthquake.id);
    expect(result[0].latitude).toBe(45);
    expect(result[0].depth).toBe(10);
    expect(result[0].magnitude).toBe(5.0);
    expect(result[0].timestamp).toBe('2024-01-01T00:00:00Z');
    expect(result[0].location).toBe('Test Location');
  });

  it('handles empty array', () => {
    const result = normalizeCoordinates([]);

    expect(result).toEqual([]);
  });
});

describe('createPositionBuffer', () => {
  const createEarthquake = (lng: number, lat: number): Earthquake => ({
    id: `eq-${lng}-${lat}`,
    longitude: lng,
    latitude: lat,
    depth: 10,
    magnitude: 5.0,
    timestamp: '2024-01-01T00:00:00Z',
    location: 'Test Location',
  });

  it('returns Float32Array with correct length', () => {
    const earthquakes = [
      createEarthquake(-122.4, 37.8),
      createEarthquake(139.7, 35.7),
      createEarthquake(0, 0),
    ];

    const result = createPositionBuffer(earthquakes);

    expect(result).toBeInstanceOf(Float32Array);
    expect(result.length).toBe(6); // 3 earthquakes * 2 values each
  });

  it('positions are correctly interleaved [lng, lat, lng, lat, ...]', () => {
    const earthquakes = [
      createEarthquake(-122.4, 37.8),
      createEarthquake(139.7, 35.7),
    ];

    const result = createPositionBuffer(earthquakes);

    expect(result[0]).toBeCloseTo(-122.4);
    expect(result[1]).toBeCloseTo(37.8);
    expect(result[2]).toBeCloseTo(139.7);
    expect(result[3]).toBeCloseTo(35.7);
  });

  it('handles empty array', () => {
    const result = createPositionBuffer([]);

    expect(result).toBeInstanceOf(Float32Array);
    expect(result.length).toBe(0);
  });

  it('handles single earthquake', () => {
    const earthquakes = [createEarthquake(-122.4, 37.8)];

    const result = createPositionBuffer(earthquakes);

    expect(result.length).toBe(2);
    expect(result[0]).toBeCloseTo(-122.4);
    expect(result[1]).toBeCloseTo(37.8);
  });
});
