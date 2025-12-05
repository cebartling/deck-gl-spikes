import { useState, useEffect, useMemo } from 'react';
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';
import type { CountyFeatureCollection } from '../types/county';
import type { MidtermYear, MidtermCountyVoting } from '../types/midterm';
import { useMidtermData } from './useMidtermData';
import { fetchCountyGeometry } from '../api/countyGeometry';

// Cache geometry since it doesn't change between years (shared with presidential data)
let geometryCache: FeatureCollection<
  Polygon | MultiPolygon,
  { name: string }
> | null = null;

interface UseMidtermVotingDataResult {
  data: CountyFeatureCollection | null;
  loading: boolean;
  error: Error | null;
}

export function useMidtermVotingData(
  year: MidtermYear
): UseMidtermVotingDataResult {
  const [geometry, setGeometry] = useState<FeatureCollection<
    Polygon | MultiPolygon,
    { name: string }
  > | null>(geometryCache);
  const [geometryLoading, setGeometryLoading] = useState(!geometryCache);
  const [geometryError, setGeometryError] = useState<Error | null>(null);

  const {
    data: midtermData,
    loading: midtermLoading,
    error: midtermError,
  } = useMidtermData(year);

  // Load geometry once (only if not cached)
  useEffect(() => {
    // Skip if already have geometry (from cache or previous fetch)
    if (geometry) {
      return;
    }

    let cancelled = false;

    fetchCountyGeometry()
      .then((geo) => {
        if (!cancelled) {
          geometryCache = geo;
          setGeometry(geo);
          setGeometryLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setGeometryError(
            err instanceof Error ? err : new Error('Failed to load geometry')
          );
          setGeometryLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [geometry]);

  // Merge geometry with midterm data
  const data = useMemo(() => {
    if (!geometry || !midtermData) return null;

    // Create lookup map for midterm data
    const midtermMap = new Map<string, MidtermCountyVoting>();
    midtermData.forEach((county) => {
      midtermMap.set(county.fips, county);
    });

    // Merge geometry with midterm data
    const features = geometry.features
      .map((feature) => {
        const fips = feature.id?.toString().padStart(5, '0') || '';
        const midterm = midtermMap.get(fips);

        if (!midterm) return null;

        return {
          type: 'Feature' as const,
          properties: midterm,
          geometry: feature.geometry,
        };
      })
      .filter((f): f is NonNullable<typeof f> => f !== null);

    return { type: 'FeatureCollection' as const, features };
  }, [geometry, midtermData]);

  return {
    data,
    loading: geometryLoading || midtermLoading,
    error: geometryError || midtermError,
  };
}

// Export for testing
export { geometryCache };
