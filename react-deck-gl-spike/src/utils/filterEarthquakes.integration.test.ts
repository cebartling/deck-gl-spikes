import { describe, it, expect } from 'vitest';
import { filterByDateRange } from './filterEarthquakes';
import type { Earthquake } from '../types/earthquake';

/**
 * Integration tests for date range filtering with real-world earthquake data formats.
 * These tests verify that the fix for timestamp parsing works correctly end-to-end.
 */
describe('filterByDateRange integration', () => {
  // Simulate earthquakes with ISO 8601 timestamps (as they would be after transformation)
  const earthquakes: Earthquake[] = [
    {
      id: 'eq1',
      longitude: -122.5,
      latitude: 37.5,
      depth: 10,
      magnitude: 4.5,
      timestamp: '2024-01-15T08:30:00.000Z',
      location: 'San Francisco, CA',
    },
    {
      id: 'eq2',
      longitude: -118.2,
      latitude: 34.0,
      depth: 15,
      magnitude: 3.2,
      timestamp: '2024-01-20T14:45:00.000Z',
      location: 'Los Angeles, CA',
    },
    {
      id: 'eq3',
      longitude: -122.3,
      latitude: 47.6,
      depth: 25,
      magnitude: 5.1,
      timestamp: '2024-01-25T22:15:00.000Z',
      location: 'Seattle, WA',
    },
    {
      id: 'eq4',
      longitude: 139.7,
      latitude: 35.7,
      depth: 50,
      magnitude: 6.2,
      timestamp: '2024-01-28T03:00:00.000Z',
      location: 'Tokyo, Japan',
    },
    {
      id: 'eq5',
      longitude: -155.5,
      latitude: 19.5,
      depth: 8,
      magnitude: 4.0,
      timestamp: '2024-01-30T18:30:00.000Z',
      location: 'Hawaii, USA',
    },
  ];

  describe('preset time period filters', () => {
    it('filters earthquakes for last 24 hours', () => {
      // Simulate "now" being 2024-01-31T00:00:00Z
      const now = new Date('2024-01-31T00:00:00.000Z');
      const start = new Date(now);
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);

      const result = filterByDateRange(earthquakes, {
        startDate: start,
        endDate: now,
      });

      // Should include eq5 (Jan 30) only
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('eq5');
    });

    it('filters earthquakes for last 7 days', () => {
      // Simulate "now" being 2024-01-31T00:00:00Z
      const now = new Date('2024-01-31T00:00:00.000Z');
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);

      const result = filterByDateRange(earthquakes, {
        startDate: start,
        endDate: now,
      });

      // Should include eq3 (Jan 25), eq4 (Jan 28), eq5 (Jan 30)
      expect(result).toHaveLength(3);
      expect(result.map((e) => e.id)).toEqual(['eq3', 'eq4', 'eq5']);
    });

    it('filters earthquakes for last 30 days', () => {
      // Simulate "now" being 2024-01-31T00:00:00Z
      const now = new Date('2024-01-31T00:00:00.000Z');
      const start = new Date(now);
      start.setDate(now.getDate() - 30);
      start.setHours(0, 0, 0, 0);

      const result = filterByDateRange(earthquakes, {
        startDate: start,
        endDate: now,
      });

      // Should include all earthquakes (all are within 30 days of Jan 31)
      expect(result).toHaveLength(5);
    });

    it('returns all earthquakes when "All" preset is selected (null dates)', () => {
      const result = filterByDateRange(earthquakes, {
        startDate: null,
        endDate: null,
      });

      expect(result).toHaveLength(5);
      expect(result).toBe(earthquakes); // Same reference for efficiency
    });
  });

  describe('custom date range filters', () => {
    it('filters earthquakes within a custom date range', () => {
      const result = filterByDateRange(earthquakes, {
        startDate: new Date('2024-01-18T00:00:00.000Z'),
        endDate: new Date('2024-01-26T23:59:59.000Z'),
      });

      // Should include eq2 (Jan 20) and eq3 (Jan 25)
      expect(result).toHaveLength(2);
      expect(result.map((e) => e.id)).toEqual(['eq2', 'eq3']);
    });

    it('filters earthquakes with only start date', () => {
      const result = filterByDateRange(earthquakes, {
        startDate: new Date('2024-01-22T00:00:00.000Z'),
        endDate: null,
      });

      // Should include eq3 (Jan 25), eq4 (Jan 28), eq5 (Jan 30)
      expect(result).toHaveLength(3);
      expect(result.map((e) => e.id)).toEqual(['eq3', 'eq4', 'eq5']);
    });

    it('filters earthquakes with only end date', () => {
      const result = filterByDateRange(earthquakes, {
        startDate: null,
        endDate: new Date('2024-01-22T00:00:00.000Z'),
      });

      // Should include eq1 (Jan 15), eq2 (Jan 20) - end of day extends to 23:59:59.999
      expect(result).toHaveLength(2);
      expect(result.map((e) => e.id)).toEqual(['eq1', 'eq2']);
    });
  });

  describe('edge cases', () => {
    it('handles earthquakes exactly on the start date boundary', () => {
      const result = filterByDateRange(earthquakes, {
        startDate: new Date('2024-01-15T08:30:00.000Z'),
        endDate: null,
      });

      // Should include eq1 which is exactly at the start date
      expect(result.map((e) => e.id)).toContain('eq1');
    });

    it('handles earthquakes exactly on the end date boundary', () => {
      const result = filterByDateRange(earthquakes, {
        startDate: null,
        endDate: new Date('2024-01-15T00:00:00.000Z'),
      });

      // Should include eq1 because end of day extends to 23:59:59.999
      expect(result.map((e) => e.id)).toContain('eq1');
    });

    it('returns empty array when date range excludes all earthquakes', () => {
      const result = filterByDateRange(earthquakes, {
        startDate: new Date('2024-02-01T00:00:00.000Z'),
        endDate: new Date('2024-02-28T23:59:59.000Z'),
      });

      expect(result).toHaveLength(0);
    });

    it('returns empty array when filtering empty earthquake list', () => {
      const result = filterByDateRange([], {
        startDate: new Date('2024-01-01T00:00:00.000Z'),
        endDate: new Date('2024-12-31T23:59:59.000Z'),
      });

      expect(result).toHaveLength(0);
    });

    it('handles single day range correctly', () => {
      const result = filterByDateRange(earthquakes, {
        startDate: new Date('2024-01-20T00:00:00.000Z'),
        endDate: new Date('2024-01-20T00:00:00.000Z'),
      });

      // Should include eq2 which is on Jan 20
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('eq2');
    });
  });

  describe('timestamp format validation', () => {
    it('correctly parses ISO 8601 timestamps with milliseconds', () => {
      const earthquakeWithMs: Earthquake = {
        id: 'test',
        longitude: 0,
        latitude: 0,
        depth: 10,
        magnitude: 5.0,
        timestamp: '2024-01-20T14:45:30.123Z',
        location: 'Test',
      };

      const result = filterByDateRange([earthquakeWithMs], {
        startDate: new Date('2024-01-20T00:00:00.000Z'),
        endDate: new Date('2024-01-20T23:59:59.999Z'),
      });

      expect(result).toHaveLength(1);
    });

    it('correctly parses ISO 8601 timestamps without milliseconds', () => {
      const earthquakeWithoutMs: Earthquake = {
        id: 'test',
        longitude: 0,
        latitude: 0,
        depth: 10,
        magnitude: 5.0,
        timestamp: '2024-01-20T14:45:30Z',
        location: 'Test',
      };

      const result = filterByDateRange([earthquakeWithoutMs], {
        startDate: new Date('2024-01-20T00:00:00.000Z'),
        endDate: new Date('2024-01-20T23:59:59.999Z'),
      });

      expect(result).toHaveLength(1);
    });
  });
});
