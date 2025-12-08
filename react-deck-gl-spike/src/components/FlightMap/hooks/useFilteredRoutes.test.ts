import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilteredRoutes } from './useFilteredRoutes';
import { useFlightFilterStore } from '../../../stores/flightFilterStore';
import type { FlightRoute } from '../../../types/flight';

const mockRoutes: FlightRoute[] = [
  {
    id: 'route-1',
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
    frequency: 42,
  },
  {
    id: 'route-2',
    origin: {
      code: 'JFK',
      name: 'John F. Kennedy International Airport',
      city: 'New York',
      country: 'USA',
      longitude: -73.7781,
      latitude: 40.6413,
    },
    destination: {
      code: 'ORD',
      name: "O'Hare International Airport",
      city: 'Chicago',
      country: 'USA',
      longitude: -87.9073,
      latitude: 41.9742,
    },
    frequency: 56,
  },
  {
    id: 'route-3',
    origin: {
      code: 'SFO',
      name: 'San Francisco International Airport',
      city: 'San Francisco',
      country: 'USA',
      longitude: -122.3789,
      latitude: 37.6213,
    },
    destination: {
      code: 'LAX',
      name: 'Los Angeles International Airport',
      city: 'Los Angeles',
      country: 'USA',
      longitude: -118.4085,
      latitude: 33.9425,
    },
    frequency: 28,
  },
];

describe('useFilteredRoutes', () => {
  beforeEach(() => {
    useFlightFilterStore.getState().reset();
  });

  it('returns all routes when no airport selected', () => {
    const { result } = renderHook(() => useFilteredRoutes(mockRoutes));

    expect(result.current.filteredRoutes).toHaveLength(3);
    expect(result.current.isFiltered).toBe(false);
    expect(result.current.selectedAirportData).toBeNull();
  });

  it('filters routes by origin when filterMode is "origin"', () => {
    act(() => {
      useFlightFilterStore.getState().setSelectedAirport('JFK');
      useFlightFilterStore.getState().setFilterMode('origin');
    });

    const { result } = renderHook(() => useFilteredRoutes(mockRoutes));

    expect(result.current.filteredRoutes).toHaveLength(1);
    expect(result.current.filteredRoutes[0].id).toBe('route-2');
    expect(result.current.isFiltered).toBe(true);
  });

  it('filters routes by destination when filterMode is "destination"', () => {
    act(() => {
      useFlightFilterStore.getState().setSelectedAirport('LAX');
      useFlightFilterStore.getState().setFilterMode('destination');
    });

    const { result } = renderHook(() => useFilteredRoutes(mockRoutes));

    expect(result.current.filteredRoutes).toHaveLength(1);
    expect(result.current.filteredRoutes[0].id).toBe('route-3');
  });

  it('filters routes by both origin and destination when filterMode is "both"', () => {
    act(() => {
      useFlightFilterStore.getState().setSelectedAirport('LAX');
      useFlightFilterStore.getState().setFilterMode('both');
    });

    const { result } = renderHook(() => useFilteredRoutes(mockRoutes));

    // LAX is origin of route-1 and destination of route-3
    expect(result.current.filteredRoutes).toHaveLength(2);
    expect(result.current.filteredRoutes.map((r) => r.id).sort()).toEqual([
      'route-1',
      'route-3',
    ]);
  });

  it('calculates stats correctly', () => {
    act(() => {
      useFlightFilterStore.getState().setSelectedAirport('JFK');
      useFlightFilterStore.getState().setFilterMode('both');
    });

    const { result } = renderHook(() => useFilteredRoutes(mockRoutes));

    // JFK: route-1 (LAX->JFK) and route-2 (JFK->ORD)
    expect(result.current.stats.totalRoutes).toBe(2);
    expect(result.current.stats.totalFlights).toBe(42 + 56); // 98
    expect(result.current.stats.connectedAirports).toBe(3); // LAX, JFK, ORD
  });

  it('returns selectedAirportData for selected airport', () => {
    act(() => {
      useFlightFilterStore.getState().setSelectedAirport('LAX');
    });

    const { result } = renderHook(() => useFilteredRoutes(mockRoutes));

    expect(result.current.selectedAirportData).not.toBeNull();
    expect(result.current.selectedAirportData?.code).toBe('LAX');
    expect(result.current.selectedAirportData?.city).toBe('Los Angeles');
  });

  it('returns null selectedAirportData when airport not found', () => {
    act(() => {
      useFlightFilterStore.getState().setSelectedAirport('INVALID');
    });

    const { result } = renderHook(() => useFilteredRoutes(mockRoutes));

    expect(result.current.selectedAirportData).toBeNull();
    expect(result.current.filteredRoutes).toHaveLength(0);
  });

  it('calculates stats for unfiltered routes', () => {
    const { result } = renderHook(() => useFilteredRoutes(mockRoutes));

    expect(result.current.stats.totalRoutes).toBe(3);
    expect(result.current.stats.totalFlights).toBe(42 + 56 + 28); // 126
    expect(result.current.stats.connectedAirports).toBe(4); // LAX, JFK, ORD, SFO
  });
});
