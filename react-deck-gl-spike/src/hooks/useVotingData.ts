import { useState, useEffect, useMemo } from 'react';
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';
import type { CountyFeatureCollection, CountyVoting } from '../types/county';
import type { ElectionYear } from '../types/election';
import type { MidtermYear, MidtermCountyVoting } from '../types/midterm';
import { useElectionData } from './useElectionData';
import { useMidtermData } from './useMidtermData';
import { fetchCountyGeometry } from '../api/countyGeometry';

type ElectionType = 'presidential' | 'midterm';

// Cache geometry since it doesn't change between years
let geometryCache: FeatureCollection<
  Polygon | MultiPolygon,
  { name: string }
> | null = null;

interface UseVotingDataParams {
  electionType: ElectionType;
  presidentialYear: ElectionYear;
  midtermYear: MidtermYear;
}

interface UseVotingDataResult {
  data: CountyFeatureCollection | null;
  loading: boolean;
  error: Error | null;
  selectedYear: ElectionYear | MidtermYear;
}

/**
 * Custom hook that conditionally fetches voting data based on election type.
 * This avoids unnecessary network requests by only fetching the data needed
 * for the currently selected election type.
 */
export function useVotingData({
  electionType,
  presidentialYear,
  midtermYear,
}: UseVotingDataParams): UseVotingDataResult {
  const [geometry, setGeometry] = useState<FeatureCollection<
    Polygon | MultiPolygon,
    { name: string }
  > | null>(geometryCache);
  const [geometryLoading, setGeometryLoading] = useState(!geometryCache);
  const [geometryError, setGeometryError] = useState<Error | null>(null);

  // Conditionally fetch election data based on election type
  const {
    data: presidentialElectionData,
    loading: presidentialLoading,
    error: presidentialError,
  } = useElectionData(electionType === 'presidential' ? presidentialYear : 2024);

  const {
    data: midtermElectionData,
    loading: midtermLoading,
    error: midtermError,
  } = useMidtermData(electionType === 'midterm' ? midtermYear : 2022);

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

  // Merge geometry with election data based on election type
  const data = useMemo(() => {
    if (!geometry) return null;

    if (electionType === 'presidential') {
      if (!presidentialElectionData) return null;

      // Create lookup map for presidential election data
      const electionMap = new Map<string, CountyVoting>();
      presidentialElectionData.forEach((county) => {
        electionMap.set(county.fips, county);
      });

      // Merge geometry with presidential election data
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
    } else {
      if (!midtermElectionData) return null;

      // Create lookup map for midterm election data
      const midtermMap = new Map<string, MidtermCountyVoting>();
      midtermElectionData.forEach((county) => {
        midtermMap.set(county.fips, county);
      });

      // Merge geometry with midterm election data
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
    }
  }, [geometry, electionType, presidentialElectionData, midtermElectionData]);

  // Select active loading and error states based on election type
  const loading =
    geometryLoading ||
    (electionType === 'presidential' ? presidentialLoading : midtermLoading);
  const error =
    geometryError ||
    (electionType === 'presidential' ? presidentialError : midtermError);
  const selectedYear =
    electionType === 'presidential' ? presidentialYear : midtermYear;

  return {
    data,
    loading,
    error,
    selectedYear,
  };
}

// Export for testing
export { geometryCache };

