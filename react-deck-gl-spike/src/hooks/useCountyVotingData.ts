import { useState, useEffect } from 'react';
import type { CountyFeatureCollection } from '../types/county';
import { fetchCountyVotingData } from '../api/electionData';

interface UseCountyVotingDataResult {
  data: CountyFeatureCollection | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch 2024 county voting data.
 *
 * Fetches data from:
 * - County boundaries: US Atlas TopoJSON (via jsDelivr CDN)
 * - Voting results: tonmcg/US_County_Level_Election_Results_08-24 (GitHub)
 */
export function useCountyVotingData(): UseCountyVotingDataResult {
  const [data, setData] = useState<CountyFeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const result = await fetchCountyVotingData();
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error('Failed to load data')
          );
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
