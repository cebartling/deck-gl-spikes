import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useFlightRoutesStore } from './flightRoutesStore';
import type { FlightRoute } from '../types/flight';

declare const global: typeof globalThis;

const mockRoutes: FlightRoute[] = [
  {
    id: 'LAX-JFK',
    origin: {
      code: 'LAX',
      name: 'Los Angeles International Airport',
      city: 'Los Angeles',
      country: 'USA',
      longitude: -118.4085,
      latitude: 33.9425,
    },
    destination: {
      code: 'JFK',
      name: 'John F. Kennedy International Airport',
      city: 'New York',
      country: 'USA',
      longitude: -73.7781,
      latitude: 40.6413,
    },
    frequency: 280,
  },
  {
    id: 'ORD-ATL',
    origin: {
      code: 'ORD',
      name: "O'Hare International Airport",
      city: 'Chicago',
      country: 'USA',
      longitude: -87.9048,
      latitude: 41.9742,
    },
    destination: {
      code: 'ATL',
      name: 'Hartsfield-Jackson Atlanta International Airport',
      city: 'Atlanta',
      country: 'USA',
      longitude: -84.4281,
      latitude: 33.6407,
    },
    frequency: 210,
  },
];

describe('flightRoutesStore', () => {
  beforeEach(() => {
    useFlightRoutesStore.getState().reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('has correct initial state', () => {
    const state = useFlightRoutesStore.getState();
    expect(state.routes).toEqual([]);
    expect(state.airports.size).toBe(0);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.lastFetchedUrl).toBe(null);
  });

  it('setRoutes updates routes', () => {
    useFlightRoutesStore.getState().setRoutes(mockRoutes);
    const state = useFlightRoutesStore.getState();
    expect(state.routes).toEqual(mockRoutes);
  });

  it('setRoutes extracts unique airports', () => {
    useFlightRoutesStore.getState().setRoutes(mockRoutes);
    const state = useFlightRoutesStore.getState();
    expect(state.airports.size).toBe(4);
    expect(state.airports.has('LAX')).toBe(true);
    expect(state.airports.has('JFK')).toBe(true);
    expect(state.airports.has('ORD')).toBe(true);
    expect(state.airports.has('ATL')).toBe(true);
  });

  it('setLoading updates loading state', () => {
    useFlightRoutesStore.getState().setLoading(true);
    expect(useFlightRoutesStore.getState().loading).toBe(true);
    useFlightRoutesStore.getState().setLoading(false);
    expect(useFlightRoutesStore.getState().loading).toBe(false);
  });

  it('setError updates error state', () => {
    const error = new Error('Test error');
    useFlightRoutesStore.getState().setError(error);
    expect(useFlightRoutesStore.getState().error).toBe(error);
  });

  it('clearError clears the error', () => {
    useFlightRoutesStore.getState().setError(new Error('Test error'));
    useFlightRoutesStore.getState().clearError();
    expect(useFlightRoutesStore.getState().error).toBe(null);
  });

  it('reset returns to initial state', () => {
    useFlightRoutesStore.getState().setRoutes(mockRoutes);
    useFlightRoutesStore.getState().setLoading(true);
    useFlightRoutesStore.getState().setError(new Error('Test error'));
    useFlightRoutesStore.getState().reset();

    const state = useFlightRoutesStore.getState();
    expect(state.routes).toEqual([]);
    expect(state.airports.size).toBe(0);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  describe('fetchRoutes', () => {
    it('fetches routes successfully', async () => {
      const mockResponse = { routes: mockRoutes };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      await useFlightRoutesStore.getState().fetchRoutes('/data/test.json');

      const state = useFlightRoutesStore.getState();
      expect(state.routes).toEqual(mockRoutes);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('handles fetch error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      await useFlightRoutesStore.getState().fetchRoutes('/data/not-found.json');

      const state = useFlightRoutesStore.getState();
      expect(state.routes).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeInstanceOf(Error);
      expect(state.error?.message).toContain('404');
    });

    it('handles network error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await useFlightRoutesStore.getState().fetchRoutes('/data/test.json');

      const state = useFlightRoutesStore.getState();
      expect(state.loading).toBe(false);
      expect(state.error?.message).toBe('Network error');
    });
  });
});
