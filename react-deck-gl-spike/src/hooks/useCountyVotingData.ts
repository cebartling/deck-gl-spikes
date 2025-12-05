import { useState, useEffect, useMemo } from 'react';
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';
import type { CountyFeatureCollection, CountyVoting } from '../types/county';
import type { ElectionYear } from '../types/election';
import { useElectionData } from './useElectionData';
import { fetchCountyGeometry } from '../api/countyGeometry';

// Cache geometry since it doesn't change between years
let geometryCache: FeatureCollection<
  Polygon | MultiPolygon,
  { name: string }
> | null = null;

interface UseCountyVotingDataResult {
  data: CountyFeatureCollection | null;
  loading: boolean;
  error: Error | null;
}

export function useCountyVotingData(
  year: ElectionYear
): UseCountyVotingDataResult {
  const [geometry, setGeometry] = useState<FeatureCollection<
    Polygon | MultiPolygon,
    { name: string }
  > | null>(geometryCache);
  const [geometryLoading, setGeometryLoading] = useState(!geometryCache);
  const [geometryError, setGeometryError] = useState<Error | null>(null);

  const {
    data: electionData,
    loading: electionLoading,
    error: electionError,
  } = useElectionData(year);

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

  // Merge geometry with election data
  const data = useMemo(() => {
    if (!geometry || !electionData) return null;

    // Create lookup map for election data
    const electionMap = new Map<string, CountyVoting>();
    electionData.forEach((county) => {
      electionMap.set(county.fips, county);
    });

    // Merge geometry with election data
    const features = geometry.features
      .map((feature) => {
        const fips = feature.id?.toString().padStart(5, '0') || '';
        const election = electionMap.get(fips);

        if (!election) return null;

        return {
          type: 'Feature' as const,
          properties: election,
          geometry: feature.geometry,
        };
      })
      .filter((f): f is NonNullable<typeof f> => f !== null);

    return { type: 'FeatureCollection' as const, features };
  }, [geometry, electionData]);

  return {
    data,
    loading: geometryLoading || electionLoading,
    error: geometryError || electionError,
  };
}

// Export for testing
export { geometryCache };
