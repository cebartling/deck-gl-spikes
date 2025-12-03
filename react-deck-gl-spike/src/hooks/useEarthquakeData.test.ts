import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEarthquakeData, transformGeoJSONFeature } from './useEarthquakeData';
import type { GeoJSONFeature, GeoJSONResponse } from '../types/earthquake';

declare const global: typeof globalThis;

describe('useEarthquakeData', () => {
  const mockGeoJSONResponse: GeoJSONResponse = {
    type: 'FeatureCollection',
    features: [
      {
        id: 'eq1',
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.5, 37.5, 10],
        },
        properties: {
          mag: 4.5,
          time: 1704067200000, // 2024-01-01T00:00:00.000Z
          place: 'San Francisco, CA',
        },
      },
      {
        id: 'eq2',
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [139.7, 35.7, 350],
        },
        properties: {
          mag: 6.0,
          time: 1704153600000, // 2024-01-02T00:00:00.000Z
          place: 'Tokyo, Japan',
        },
      },
    ],
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loading state is true initially', () => {
    vi.spyOn(global, 'fetch').mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() =>
      useEarthquakeData('https://example.com/earthquakes.json')
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('loading state is false after fetch completes', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockGeoJSONResponse,
    } as Response);

    const { result } = renderHook(() =>
      useEarthquakeData('https://example.com/earthquakes.json')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('data is transformed correctly from GeoJSON', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockGeoJSONResponse,
    } as Response);

    const { result } = renderHook(() =>
      useEarthquakeData('https://example.com/earthquakes.json')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0]).toEqual({
      id: 'eq1',
      longitude: -122.5,
      latitude: 37.5,
      depth: 10,
      magnitude: 4.5,
      timestamp: '2024-01-01T00:00:00.000Z',
      location: 'San Francisco, CA',
    });
  });

  it('sets error state on fetch failure', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() =>
      useEarthquakeData('https://example.com/earthquakes.json')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network error');
    expect(result.current.data).toEqual([]);
  });

  it('sets error state on non-ok response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    const { result } = renderHook(() =>
      useEarthquakeData('https://example.com/earthquakes.json')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('HTTP error! status: 404');
  });

  it('refetches when URL changes', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockGeoJSONResponse,
    } as Response);

    const { result, rerender } = renderHook(
      ({ url }) => useEarthquakeData(url),
      { initialProps: { url: 'https://example.com/earthquakes1.json' } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    rerender({ url: 'https://example.com/earthquakes2.json' });

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });
  });

  it('sets error state when API response fails Zod validation', async () => {
    const invalidResponse = {
      type: 'FeatureCollection',
      features: [
        {
          id: 'eq1',
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: ['invalid', 37.5, 10], // Invalid: string instead of number
          },
          properties: {
            mag: 4.5,
            time: 1704067200000,
            place: 'San Francisco, CA',
          },
        },
      ],
    };

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => invalidResponse,
    } as Response);

    const { result } = renderHook(() =>
      useEarthquakeData('https://example.com/earthquakes.json')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toEqual([]);
  });

  it('sets error state when API response has wrong structure', async () => {
    const invalidResponse = {
      type: 'InvalidType', // Wrong type
      features: [],
    };

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => invalidResponse,
    } as Response);

    const { result } = renderHook(() =>
      useEarthquakeData('https://example.com/earthquakes.json')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toEqual([]);
  });
});

describe('transformGeoJSONFeature', () => {
  it('transforms GeoJSON feature to Earthquake object', () => {
    const feature: GeoJSONFeature = {
      id: 'test-id',
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-120.5, 35.0, 25.5],
      },
      properties: {
        mag: 5.5,
        time: 1718452800000, // 2024-06-15T12:00:00.000Z
        place: 'Central California',
      },
    };

    const result = transformGeoJSONFeature(feature);

    expect(result).toEqual({
      id: 'test-id',
      longitude: -120.5,
      latitude: 35.0,
      depth: 25.5,
      magnitude: 5.5,
      timestamp: '2024-06-15T12:00:00.000Z',
      location: 'Central California',
    });
  });

  it('handles null magnitude by defaulting to 0', () => {
    const feature: GeoJSONFeature = {
      id: 'test-id',
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-120.5, 35.0, 25.5],
      },
      properties: {
        mag: null,
        time: 1718452800000,
        place: 'Central California',
      },
    };

    const result = transformGeoJSONFeature(feature);

    expect(result.magnitude).toBe(0);
  });

  it('handles null place by defaulting to Unknown location', () => {
    const feature: GeoJSONFeature = {
      id: 'test-id',
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-120.5, 35.0, 25.5],
      },
      properties: {
        mag: 5.5,
        time: 1718452800000,
        place: null,
      },
    };

    const result = transformGeoJSONFeature(feature);

    expect(result.location).toBe('Unknown location');
  });
});
