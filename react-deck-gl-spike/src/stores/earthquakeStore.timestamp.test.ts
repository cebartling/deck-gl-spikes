import { describe, it, expect } from 'vitest';
import { transformGeoJSONFeature } from './earthquakeStore';
import type { GeoJSONFeature } from '../types/earthquake';

/**
 * Tests specifically for timestamp transformation from USGS API format (Unix ms)
 * to application format (ISO 8601 string).
 *
 * This test suite validates the fix for the date range filtering issue where
 * timestamps were incorrectly parsed, causing filters to not work.
 */
describe('transformGeoJSONFeature timestamp handling', () => {
  describe('Unix millisecond to ISO 8601 conversion', () => {
    it('converts Unix milliseconds to ISO 8601 string', () => {
      const feature: GeoJSONFeature = {
        id: 'test-1',
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.5, 37.5, 10],
        },
        properties: {
          mag: 4.5,
          time: 1704067200000, // 2024-01-01T00:00:00.000Z
          place: 'Test Location',
        },
      };

      const result = transformGeoJSONFeature(feature);

      expect(result.timestamp).toBe('2024-01-01T00:00:00.000Z');
    });

    it('preserves millisecond precision in timestamp', () => {
      const feature: GeoJSONFeature = {
        id: 'test-2',
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0, 0, 0],
        },
        properties: {
          mag: 5.0,
          time: 1704067200123, // 2024-01-01T00:00:00.123Z
          place: 'Test',
        },
      };

      const result = transformGeoJSONFeature(feature);

      expect(result.timestamp).toBe('2024-01-01T00:00:00.123Z');
    });

    it('handles various Unix timestamps correctly', () => {
      const testCases = [
        { unix: 0, expected: '1970-01-01T00:00:00.000Z' },
        { unix: 1609459200000, expected: '2021-01-01T00:00:00.000Z' },
        { unix: 1672531199999, expected: '2022-12-31T23:59:59.999Z' },
        { unix: 1735689600000, expected: '2025-01-01T00:00:00.000Z' },
      ];

      for (const { unix, expected } of testCases) {
        const feature: GeoJSONFeature = {
          id: `test-${unix}`,
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0, 0],
          },
          properties: {
            mag: 5.0,
            time: unix,
            place: 'Test',
          },
        };

        const result = transformGeoJSONFeature(feature);
        expect(result.timestamp).toBe(expected);
      }
    });
  });

  describe('timestamp usability for date filtering', () => {
    it('produces timestamps that can be parsed by Date constructor', () => {
      const feature: GeoJSONFeature = {
        id: 'test',
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0, 0, 0],
        },
        properties: {
          mag: 5.0,
          time: 1704067200000,
          place: 'Test',
        },
      };

      const result = transformGeoJSONFeature(feature);
      const parsedDate = new Date(result.timestamp);

      expect(parsedDate.getTime()).not.toBeNaN();
      expect(parsedDate.getTime()).toBe(1704067200000);
    });

    it('produces timestamps compatible with date comparison operations', () => {
      const feature: GeoJSONFeature = {
        id: 'test',
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0, 0, 0],
        },
        properties: {
          mag: 5.0,
          time: 1704153600000, // 2024-01-02T00:00:00.000Z
          place: 'Test',
        },
      };

      const result = transformGeoJSONFeature(feature);
      const earthquakeTime = new Date(result.timestamp).getTime();

      const startOfDay = new Date('2024-01-02T00:00:00.000Z').getTime();
      const endOfDay = new Date('2024-01-02T23:59:59.999Z').getTime();

      expect(earthquakeTime).toBeGreaterThanOrEqual(startOfDay);
      expect(earthquakeTime).toBeLessThanOrEqual(endOfDay);
    });
  });

  describe('real USGS API data format simulation', () => {
    it('handles recent earthquake timestamp from USGS format', () => {
      // Simulate a real USGS API response timestamp
      const recentTimestamp = Date.now();

      const feature: GeoJSONFeature = {
        id: 'us7000abc',
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-117.5, 33.5, 12.5],
        },
        properties: {
          mag: 3.5,
          time: recentTimestamp,
          place: '5km SSW of Fontana, CA',
        },
      };

      const result = transformGeoJSONFeature(feature);

      // Verify the timestamp is valid and recent
      const parsedTime = new Date(result.timestamp).getTime();
      expect(parsedTime).toBe(recentTimestamp);

      // Verify it's a valid ISO string
      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('transforms complete USGS-like feature correctly', () => {
      // This simulates data exactly as it would come from USGS API
      const feature: GeoJSONFeature = {
        id: 'nc75023511',
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.8088, 38.8347, 2.44],
        },
        properties: {
          mag: 2.5,
          time: 1701432000000, // A specific timestamp from USGS
          place: '6 km NW of The Geysers, CA',
        },
      };

      const result = transformGeoJSONFeature(feature);

      expect(result).toEqual({
        id: 'nc75023511',
        longitude: -122.8088,
        latitude: 38.8347,
        depth: 2.44,
        magnitude: 2.5,
        timestamp: '2023-12-01T12:00:00.000Z',
        location: '6 km NW of The Geysers, CA',
      });
    });
  });
});
