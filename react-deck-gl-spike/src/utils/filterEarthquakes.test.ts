import { describe, it, expect } from 'vitest';
import { filterByDateRange } from './filterEarthquakes';
import type { Earthquake } from '../types/earthquake';

describe('filterByDateRange', () => {
  const earthquakes: Earthquake[] = [
    {
      id: '1',
      longitude: 0,
      latitude: 0,
      depth: 10,
      magnitude: 5.0,
      timestamp: '2024-01-15T12:00:00Z',
      location: 'Location 1',
    },
    {
      id: '2',
      longitude: 0,
      latitude: 0,
      depth: 20,
      magnitude: 4.0,
      timestamp: '2024-01-20T12:00:00Z',
      location: 'Location 2',
    },
    {
      id: '3',
      longitude: 0,
      latitude: 0,
      depth: 30,
      magnitude: 6.0,
      timestamp: '2024-01-25T12:00:00Z',
      location: 'Location 3',
    },
  ];

  it('returns all earthquakes when no range specified', () => {
    const result = filterByDateRange(earthquakes, {
      startDate: null,
      endDate: null,
    });
    expect(result).toHaveLength(3);
    expect(result).toEqual(earthquakes);
  });

  it('filters by start date only', () => {
    const result = filterByDateRange(earthquakes, {
      startDate: new Date('2024-01-18T00:00:00Z'),
      endDate: null,
    });
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual(['2', '3']);
  });

  it('filters by end date only', () => {
    const result = filterByDateRange(earthquakes, {
      startDate: null,
      endDate: new Date('2024-01-20T23:59:59Z'),
    });
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual(['1', '2']);
  });

  it('filters by date range', () => {
    const result = filterByDateRange(earthquakes, {
      startDate: new Date('2024-01-18T00:00:00Z'),
      endDate: new Date('2024-01-22T00:00:00Z'),
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('includes end date (end of day)', () => {
    // End date at midnight should still include earthquakes from that day
    // because the filter extends to end of day (23:59:59.999)
    const result = filterByDateRange(earthquakes, {
      startDate: null,
      endDate: new Date('2024-01-20T00:00:00Z'),
    });
    // Earthquake 1 is on 2024-01-15 at 12:00, so it should be included
    expect(result.map((e) => e.id)).toContain('1');
    // Earthquake 2 is on 2024-01-20 at 12:00 - after midnight but within end of day
    expect(result.map((e) => e.id)).toContain('2');
  });

  it('returns empty array when range excludes all earthquakes', () => {
    const result = filterByDateRange(earthquakes, {
      startDate: new Date('2024-02-01T00:00:00Z'),
      endDate: new Date('2024-02-28T00:00:00Z'),
    });
    expect(result).toHaveLength(0);
  });

  it('handles empty earthquake array', () => {
    const result = filterByDateRange([], {
      startDate: new Date('2024-01-01T00:00:00Z'),
      endDate: new Date('2024-01-31T00:00:00Z'),
    });
    expect(result).toHaveLength(0);
  });

  it('handles single earthquake within range', () => {
    const singleEarthquake = [earthquakes[1]];
    const result = filterByDateRange(singleEarthquake, {
      startDate: new Date('2024-01-19T00:00:00Z'),
      endDate: new Date('2024-01-21T00:00:00Z'),
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('handles single earthquake outside range', () => {
    const singleEarthquake = [earthquakes[0]];
    const result = filterByDateRange(singleEarthquake, {
      startDate: new Date('2024-01-20T00:00:00Z'),
      endDate: new Date('2024-01-31T00:00:00Z'),
    });
    expect(result).toHaveLength(0);
  });

  it('returns same reference when no filter applied', () => {
    const result = filterByDateRange(earthquakes, {
      startDate: null,
      endDate: null,
    });
    expect(result).toBe(earthquakes);
  });

  it('handles timestamps at exact boundary (start)', () => {
    const result = filterByDateRange(earthquakes, {
      startDate: new Date('2024-01-15T12:00:00Z'),
      endDate: null,
    });
    // Should include earthquake 1 which is exactly at the start date
    expect(result.map((e) => e.id)).toContain('1');
  });

  it('filters correctly with timezone-aware dates', () => {
    const result = filterByDateRange(earthquakes, {
      startDate: new Date('2024-01-14T00:00:00Z'),
      endDate: new Date('2024-01-16T00:00:00Z'),
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});
