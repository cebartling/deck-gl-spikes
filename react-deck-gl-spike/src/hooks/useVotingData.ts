import { useState, useEffect, useMemo } from 'react';
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';
import type { CountyFeatureCollection, CountyVoting } from '../types/county';
import type { ElectionYear } from '../types/election';
import type { MidtermYear, MidtermCountyVoting } from '../types/midterm';
import { useElectionData } from './useElectionData';
import { useMidtermData } from './useMidtermData';
import { fetchCountyGeometry } from '../api/countyGeometry';
import { getGeometryCache, setGeometryCache } from '../utils/geometryCache';

type ElectionType = 'presidential' | 'midterm';

// Get the most recent year as default fallback
const DEFAULT_PRESIDENTIAL_YEAR: ElectionYear = 2024; // ELECTION_YEARS[0]
const DEFAULT_MIDTERM_YEAR: MidtermYear = 2022; // MIDTERM_YEARS[0]

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
  const cachedGeometry = getGeometryCache();
  const [geometry, setGeometry] = useState<FeatureCollection<
    Polygon | MultiPolygon,
    { name: string }
  > | null>(cachedGeometry);
  const [geometryLoading, setGeometryLoading] = useState(!cachedGeometry);
  const [geometryError, setGeometryError] = useState<Error | null>(null);

  // Conditionally fetch election data based on election type
  // Use default years for inactive election type to minimize unnecessary fetches
  const {
    data: presidentialElectionData,
    loading: presidentialLoading,
    error: presidentialError,
  } = useElectionData(
    electionType === 'presidential'
      ? presidentialYear
      : DEFAULT_PRESIDENTIAL_YEAR
  );

  const {
    data: midtermElectionData,
    loading: midtermLoading,
    error: midtermError,
  } = useMidtermData(
    electionType === 'midterm' ? midtermYear : DEFAULT_MIDTERM_YEAR
  );

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
          setGeometryCache(geo); // Update shared cache
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

    // Select the active election data based on election type
    const electionData =
      electionType === 'presidential'
        ? presidentialElectionData
        : midtermElectionData;

    if (!electionData) return null;

    // Create lookup map for election data (works for both types)
    const dataMap = new Map<string, CountyVoting | MidtermCountyVoting>();
    electionData.forEach((county) => {
      dataMap.set(county.fips, county);
    });

    // Merge geometry with election data
    const features = geometry.features
      .map((feature) => {
        const fips = feature.id?.toString().padStart(5, '0') || '';
        const countyData = dataMap.get(fips);

        if (!countyData) return null;

        return {
          type: 'Feature' as const,
          properties: countyData,
          geometry: feature.geometry,
        };
      })
      .filter((f): f is NonNullable<typeof f> => f !== null);

    return { type: 'FeatureCollection' as const, features };
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
