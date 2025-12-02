import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import { useEarthquakeStore, transformGeoJSONFeature } from './earthquakeStore';
import type { GeoJSONFeature, GeoJSONResponse } from '../types/earthquake';

declare const global: typeof globalThis;

describe('earthquakeStore', () => {
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
          time: '2024-01-01T00:00:00Z',
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
          time: '2024-01-02T00:00:00Z',
          place: 'Tokyo, Japan',
        },
      },
    ],
  };

  beforeEach(() => {
    // Reset store before each test
    useEarthquakeStore.getState().reset();
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('has empty earthquakes array', () => {
      expect(useEarthquakeStore.getState().earthquakes).toEqual([]);
    });

    it('has loading set to false', () => {
      expect(useEarthquakeStore.getState().loading).toBe(false);
    });

    it('has error set to null', () => {
      expect(useEarthquakeStore.getState().error).toBeNull();
    });

    it('has lastFetchedUrl set to null', () => {
      expect(useEarthquakeStore.getState().lastFetchedUrl).toBeNull();
    });
  });

  describe('setEarthquakes', () => {
    it('updates earthquakes array', () => {
      const earthquakes = [
        {
          id: '1',
          longitude: -122.5,
          latitude: 37.5,
          depth: 10,
          magnitude: 4.5,
          timestamp: '2024-01-01T00:00:00Z',
          location: 'San Francisco, CA',
        },
      ];

      act(() => {
        useEarthquakeStore.getState().setEarthquakes(earthquakes);
      });

      expect(useEarthquakeStore.getState().earthquakes).toEqual(earthquakes);
    });
  });

  describe('setLoading', () => {
    it('updates loading state', () => {
      act(() => {
        useEarthquakeStore.getState().setLoading(true);
      });

      expect(useEarthquakeStore.getState().loading).toBe(true);
    });
  });

  describe('setError', () => {
    it('updates error state', () => {
      const error = new Error('Test error');

      act(() => {
        useEarthquakeStore.getState().setError(error);
      });

      expect(useEarthquakeStore.getState().error).toBe(error);
    });
  });

  describe('clearError', () => {
    it('clears error state', () => {
      act(() => {
        useEarthquakeStore.getState().setError(new Error('Test error'));
        useEarthquakeStore.getState().clearError();
      });

      expect(useEarthquakeStore.getState().error).toBeNull();
    });
  });

  describe('reset', () => {
    it('resets store to initial state', () => {
      act(() => {
        useEarthquakeStore.getState().setEarthquakes([
          {
            id: '1',
            longitude: 0,
            latitude: 0,
            depth: 0,
            magnitude: 0,
            timestamp: '',
            location: '',
          },
        ]);
        useEarthquakeStore.getState().setLoading(true);
        useEarthquakeStore.getState().setError(new Error('Test'));
        useEarthquakeStore.getState().reset();
      });

      expect(useEarthquakeStore.getState().earthquakes).toEqual([]);
      expect(useEarthquakeStore.getState().loading).toBe(false);
      expect(useEarthquakeStore.getState().error).toBeNull();
    });
  });

  describe('fetchEarthquakes', () => {
    it('sets loading to true when fetching', async () => {
      vi.spyOn(global, 'fetch').mockImplementation(
        () => new Promise(() => {})
      );

      act(() => {
        useEarthquakeStore.getState().fetchEarthquakes('https://example.com/earthquakes.json');
      });

      expect(useEarthquakeStore.getState().loading).toBe(true);
    });

    it('fetches and transforms earthquake data', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockGeoJSONResponse,
      } as Response);

      await act(async () => {
        await useEarthquakeStore.getState().fetchEarthquakes('https://example.com/earthquakes.json');
      });

      expect(useEarthquakeStore.getState().earthquakes).toHaveLength(2);
      expect(useEarthquakeStore.getState().earthquakes[0]).toEqual({
        id: 'eq1',
        longitude: -122.5,
        latitude: 37.5,
        depth: 10,
        magnitude: 4.5,
        timestamp: '2024-01-01T00:00:00Z',
        location: 'San Francisco, CA',
      });
      expect(useEarthquakeStore.getState().loading).toBe(false);
    });

    it('sets error on fetch failure', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

      await act(async () => {
        await useEarthquakeStore.getState().fetchEarthquakes('https://example.com/earthquakes.json');
      });

      expect(useEarthquakeStore.getState().error).toBeInstanceOf(Error);
      expect(useEarthquakeStore.getState().error?.message).toBe('Network error');
      expect(useEarthquakeStore.getState().loading).toBe(false);
    });

    it('sets error on non-ok response', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      await act(async () => {
        await useEarthquakeStore.getState().fetchEarthquakes('https://example.com/earthquakes.json');
      });

      expect(useEarthquakeStore.getState().error?.message).toBe('HTTP error! status: 404');
      expect(useEarthquakeStore.getState().loading).toBe(false);
    });

    it('tracks lastFetchedUrl', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockGeoJSONResponse,
      } as Response);

      await act(async () => {
        await useEarthquakeStore.getState().fetchEarthquakes('https://example.com/earthquakes.json');
      });

      expect(useEarthquakeStore.getState().lastFetchedUrl).toBe('https://example.com/earthquakes.json');
    });
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
        time: '2024-06-15T12:00:00Z',
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
      timestamp: '2024-06-15T12:00:00Z',
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
        time: '2024-06-15T12:00:00Z',
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
        time: '2024-06-15T12:00:00Z',
        place: null,
      },
    };

    const result = transformGeoJSONFeature(feature);

    expect(result.location).toBe('Unknown location');
  });
});
