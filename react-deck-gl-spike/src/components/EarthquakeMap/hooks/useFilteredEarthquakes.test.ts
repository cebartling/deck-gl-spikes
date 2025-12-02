import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFilteredEarthquakes } from './useFilteredEarthquakes';
import type { Earthquake } from '../../../types/earthquake';
import type { FilterState } from '../../../types/filters';

describe('useFilteredEarthquakes', () => {
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

  it('returns all earthquakes when no filters applied', () => {
    const filters: FilterState = {
      dateRange: { startDate: null, endDate: null },
    };

    const { result } = renderHook(() =>
      useFilteredEarthquakes(earthquakes, filters)
    );

    expect(result.current).toHaveLength(3);
  });

  it('applies date range filter correctly', () => {
    const filters: FilterState = {
      dateRange: {
        startDate: new Date('2024-01-18T00:00:00Z'),
        endDate: new Date('2024-01-22T00:00:00Z'),
      },
    };

    const { result } = renderHook(() =>
      useFilteredEarthquakes(earthquakes, filters)
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('2');
  });

  it('memoizes result when inputs unchanged', () => {
    const filters: FilterState = {
      dateRange: { startDate: null, endDate: null },
    };

    const { result, rerender } = renderHook(() =>
      useFilteredEarthquakes(earthquakes, filters)
    );

    const firstResult = result.current;
    rerender();
    const secondResult = result.current;

    expect(firstResult).toBe(secondResult);
  });

  it('recomputes when earthquakes change', () => {
    const filters: FilterState = {
      dateRange: { startDate: null, endDate: null },
    };

    const { result, rerender } = renderHook(
      ({ data, filters }) => useFilteredEarthquakes(data, filters),
      { initialProps: { data: earthquakes, filters } }
    );

    expect(result.current).toHaveLength(3);

    const newEarthquakes = earthquakes.slice(0, 2);
    rerender({ data: newEarthquakes, filters });

    expect(result.current).toHaveLength(2);
  });

  it('recomputes when filters change', () => {
    const initialFilters: FilterState = {
      dateRange: { startDate: null, endDate: null },
    };

    const { result, rerender } = renderHook(
      ({ data, filters }) => useFilteredEarthquakes(data, filters),
      { initialProps: { data: earthquakes, filters: initialFilters } }
    );

    expect(result.current).toHaveLength(3);

    const newFilters: FilterState = {
      dateRange: {
        startDate: new Date('2024-01-18T00:00:00Z'),
        endDate: null,
      },
    };
    rerender({ data: earthquakes, filters: newFilters });

    expect(result.current).toHaveLength(2);
  });

  it('handles empty earthquake array', () => {
    const filters: FilterState = {
      dateRange: { startDate: null, endDate: null },
    };

    const { result } = renderHook(() => useFilteredEarthquakes([], filters));

    expect(result.current).toHaveLength(0);
  });

  it('returns empty array when filter excludes all', () => {
    const filters: FilterState = {
      dateRange: {
        startDate: new Date('2024-02-01T00:00:00Z'),
        endDate: new Date('2024-02-28T00:00:00Z'),
      },
    };

    const { result } = renderHook(() =>
      useFilteredEarthquakes(earthquakes, filters)
    );

    expect(result.current).toHaveLength(0);
  });
});
