import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFilteredCounties } from './useFilteredCounties';
import { useCountyFilterStore } from '../../../stores/countyFilterStore';
import type { CountyFeatureCollection, CountyFeature } from '../../../types/county';

function createMockFeature(overrides: Partial<CountyFeature['properties']> = {}): CountyFeature {
  return {
    type: 'Feature',
    properties: {
      fips: '06001',
      name: 'Alameda',
      state: 'CA',
      stateFips: '06',
      totalVotes: 1000,
      democratVotes: 600,
      republicanVotes: 350,
      otherVotes: 50,
      margin: 250,
      marginPercent: 25,
      ...overrides,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
    },
  };
}

function createMockData(features: CountyFeature[]): CountyFeatureCollection {
  return {
    type: 'FeatureCollection',
    features,
  };
}

describe('useFilteredCounties', () => {
  beforeEach(() => {
    useCountyFilterStore.getState().reset();
  });

  describe('when data is null', () => {
    it('should return null filteredData', () => {
      const { result } = renderHook(() => useFilteredCounties(null));
      expect(result.current.filteredData).toBeNull();
    });

    it('should return null stats', () => {
      const { result } = renderHook(() => useFilteredCounties(null));
      expect(result.current.stats).toBeNull();
    });

    it('should return isFiltered as false', () => {
      const { result } = renderHook(() => useFilteredCounties(null));
      expect(result.current.isFiltered).toBe(false);
    });
  });

  describe('when no state filter is applied', () => {
    it('should return all counties', () => {
      const mockData = createMockData([
        createMockFeature({ fips: '06001', stateFips: '06' }),
        createMockFeature({ fips: '48001', stateFips: '48' }),
      ]);

      const { result } = renderHook(() => useFilteredCounties(mockData));
      expect(result.current.filteredData?.features).toHaveLength(2);
    });

    it('should return isFiltered as false', () => {
      const mockData = createMockData([createMockFeature()]);
      const { result } = renderHook(() => useFilteredCounties(mockData));
      expect(result.current.isFiltered).toBe(false);
    });

    it('should calculate correct stats for all counties', () => {
      const mockData = createMockData([
        createMockFeature({
          fips: '06001',
          totalVotes: 1000,
          democratVotes: 600,
          republicanVotes: 400,
        }),
        createMockFeature({
          fips: '48001',
          totalVotes: 2000,
          democratVotes: 800,
          republicanVotes: 1200,
        }),
      ]);

      const { result } = renderHook(() => useFilteredCounties(mockData));
      expect(result.current.stats?.countyCount).toBe(2);
      expect(result.current.stats?.totalVotes).toBe(3000);
      expect(result.current.stats?.democratVotes).toBe(1400);
      expect(result.current.stats?.republicanVotes).toBe(1600);
    });
  });

  describe('when state filter is applied', () => {
    it('should filter counties by state FIPS', () => {
      const mockData = createMockData([
        createMockFeature({ fips: '06001', stateFips: '06' }),
        createMockFeature({ fips: '06002', stateFips: '06' }),
        createMockFeature({ fips: '48001', stateFips: '48' }),
      ]);

      useCountyFilterStore.getState().setSelectedState('06');

      const { result } = renderHook(() => useFilteredCounties(mockData));
      expect(result.current.filteredData?.features).toHaveLength(2);
      expect(
        result.current.filteredData?.features.every(
          (f) => f.properties.stateFips === '06'
        )
      ).toBe(true);
    });

    it('should return isFiltered as true', () => {
      const mockData = createMockData([createMockFeature()]);
      useCountyFilterStore.getState().setSelectedState('06');

      const { result } = renderHook(() => useFilteredCounties(mockData));
      expect(result.current.isFiltered).toBe(true);
    });

    it('should calculate stats only for filtered counties', () => {
      const mockData = createMockData([
        createMockFeature({
          fips: '06001',
          stateFips: '06',
          totalVotes: 1000,
          democratVotes: 700,
          republicanVotes: 300,
        }),
        createMockFeature({
          fips: '48001',
          stateFips: '48',
          totalVotes: 5000,
          democratVotes: 1000,
          republicanVotes: 4000,
        }),
      ]);

      useCountyFilterStore.getState().setSelectedState('06');

      const { result } = renderHook(() => useFilteredCounties(mockData));
      expect(result.current.stats?.countyCount).toBe(1);
      expect(result.current.stats?.totalVotes).toBe(1000);
      expect(result.current.stats?.democratVotes).toBe(700);
      expect(result.current.stats?.republicanVotes).toBe(300);
    });

    it('should return empty features array when no counties match filter', () => {
      const mockData = createMockData([
        createMockFeature({ fips: '06001', stateFips: '06' }),
      ]);

      useCountyFilterStore.getState().setSelectedState('99');

      const { result } = renderHook(() => useFilteredCounties(mockData));
      expect(result.current.filteredData?.features).toHaveLength(0);
    });
  });

  describe('stats calculation', () => {
    it('should calculate positive margin for Democrat lead', () => {
      const mockData = createMockData([
        createMockFeature({
          totalVotes: 1000,
          democratVotes: 600,
          republicanVotes: 400,
        }),
      ]);

      const { result } = renderHook(() => useFilteredCounties(mockData));
      expect(result.current.stats?.overallMargin).toBe(20); // (600-400)/1000 * 100
    });

    it('should calculate negative margin for Republican lead', () => {
      const mockData = createMockData([
        createMockFeature({
          totalVotes: 1000,
          democratVotes: 400,
          republicanVotes: 600,
        }),
      ]);

      const { result } = renderHook(() => useFilteredCounties(mockData));
      expect(result.current.stats?.overallMargin).toBe(-20); // (400-600)/1000 * 100
    });

    it('should handle zero total votes', () => {
      const mockData = createMockData([
        createMockFeature({
          totalVotes: 0,
          democratVotes: 0,
          republicanVotes: 0,
        }),
      ]);

      const { result } = renderHook(() => useFilteredCounties(mockData));
      expect(result.current.stats?.overallMargin).toBe(0);
    });

    it('should handle empty features array', () => {
      const mockData = createMockData([]);

      const { result } = renderHook(() => useFilteredCounties(mockData));
      expect(result.current.stats?.countyCount).toBe(0);
      expect(result.current.stats?.totalVotes).toBe(0);
      expect(result.current.stats?.overallMargin).toBe(0);
    });
  });
});
