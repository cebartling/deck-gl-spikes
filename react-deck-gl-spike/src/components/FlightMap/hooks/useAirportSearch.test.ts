import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAirportSearch } from './useAirportSearch';
import type { Airport } from '../../../types/flight';

const mockAirports: Airport[] = [
  {
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'USA',
    longitude: -118.4085,
    latitude: 33.9425,
  },
  {
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'USA',
    longitude: -73.7781,
    latitude: 40.6413,
  },
  {
    code: 'ORD',
    name: "O'Hare International Airport",
    city: 'Chicago',
    country: 'USA',
    longitude: -87.9073,
    latitude: 41.9742,
  },
  {
    code: 'LHR',
    name: 'Heathrow Airport',
    city: 'London',
    country: 'United Kingdom',
    longitude: -0.4543,
    latitude: 51.47,
  },
  {
    code: 'CDG',
    name: 'Charles de Gaulle Airport',
    city: 'Paris',
    country: 'France',
    longitude: 2.5479,
    latitude: 49.0097,
  },
];

describe('useAirportSearch', () => {
  it('returns default airports when query is empty', () => {
    const { result } = renderHook(() => useAirportSearch(mockAirports));

    expect(result.current.searchResults.length).toBeGreaterThan(0);
    expect(result.current.searchQuery).toBe('');
  });

  it('returns matching airports for IATA code search', () => {
    const { result } = renderHook(() => useAirportSearch(mockAirports));

    act(() => {
      result.current.setSearchQuery('LAX');
    });

    expect(result.current.searchResults.length).toBe(1);
    expect(result.current.searchResults[0].code).toBe('LAX');
  });

  it('returns matching airports for city name search', () => {
    const { result } = renderHook(() => useAirportSearch(mockAirports));

    act(() => {
      result.current.setSearchQuery('Chicago');
    });

    expect(result.current.searchResults.length).toBeGreaterThan(0);
    expect(result.current.searchResults[0].code).toBe('ORD');
  });

  it('returns matching airports for airport name search', () => {
    const { result } = renderHook(() => useAirportSearch(mockAirports));

    act(() => {
      result.current.setSearchQuery('Kennedy');
    });

    expect(result.current.searchResults.length).toBeGreaterThan(0);
    expect(result.current.searchResults[0].code).toBe('JFK');
  });

  it('fuzzy matching works for typos', () => {
    const { result } = renderHook(() => useAirportSearch(mockAirports));

    act(() => {
      result.current.setSearchQuery('Hethrow'); // misspelled Heathrow
    });

    expect(result.current.searchResults.length).toBeGreaterThan(0);
    expect(result.current.searchResults[0].code).toBe('LHR');
  });

  it('clearSearch resets query', () => {
    const { result } = renderHook(() => useAirportSearch(mockAirports));

    act(() => {
      result.current.setSearchQuery('LAX');
    });

    expect(result.current.searchQuery).toBe('LAX');

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchQuery).toBe('');
  });

  it('returns default results for single character query', () => {
    const { result } = renderHook(() => useAirportSearch(mockAirports));

    act(() => {
      result.current.setSearchQuery('L');
    });

    // Should return default results since query is too short
    expect(result.current.searchResults.length).toBeGreaterThan(0);
    expect(result.current.searchResults).toEqual(mockAirports.slice(0, 10));
  });

  it('limits results to 10', () => {
    // Create more than 10 airports
    const manyAirports = Array.from({ length: 20 }, (_, i) => ({
      code: `AP${i}`,
      name: `Airport ${i}`,
      city: `City ${i}`,
      country: 'USA',
      longitude: -100 + i,
      latitude: 40,
    }));

    const { result } = renderHook(() => useAirportSearch(manyAirports));

    expect(result.current.searchResults.length).toBeLessThanOrEqual(10);
  });

  it('returns empty array for no matches', () => {
    const { result } = renderHook(() => useAirportSearch(mockAirports));

    act(() => {
      result.current.setSearchQuery('XYZNONEXISTENT');
    });

    expect(result.current.searchResults).toHaveLength(0);
  });
});
