import { useState, useEffect } from 'react';
import type { ElectionYear } from '../types/election';
import type { CountyVoting } from '../types/county';
import { CachedElectionDataSchema } from '../types/county';

// Cache for loaded election data
const electionDataCache = new Map<ElectionYear, CountyVoting[]>();

async function loadElectionData(year: ElectionYear): Promise<CountyVoting[]> {
  // Check cache first
  const cached = electionDataCache.get(year);
  if (cached) return cached;

  // Fetch from static file
  const response = await fetch(`/data/elections/${year}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load ${year} election data`);
  }

  const data = await response.json();

  // Validate with Zod
  const validated = CachedElectionDataSchema.parse(data);

  // Cache for future use
  electionDataCache.set(year, validated);

  return validated;
}

interface UseElectionDataResult {
  data: CountyVoting[] | null;
  loading: boolean;
  error: Error | null;
}

export function useElectionData(year: ElectionYear): UseElectionDataResult {
  const [data, setData] = useState<CountyVoting[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const electionData = await loadElectionData(year);
        if (!cancelled) {
          setData(electionData);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load'));
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [year]);

  return { data, loading, error };
}

// Export for testing
export { electionDataCache };
