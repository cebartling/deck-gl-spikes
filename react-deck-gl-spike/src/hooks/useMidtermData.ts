import { useState, useEffect } from 'react';
import type { MidtermYear, MidtermCountyVoting } from '../types/midterm';
import { CachedMidtermDataSchema } from '../types/midterm';

// Cache for loaded midterm election data
const midtermDataCache = new Map<MidtermYear, MidtermCountyVoting[]>();

async function loadMidtermData(
  year: MidtermYear
): Promise<MidtermCountyVoting[]> {
  // Check cache first
  const cached = midtermDataCache.get(year);
  if (cached) return cached;

  // Fetch from static file
  const response = await fetch(`/data/elections/midterm/${year}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load ${year} midterm data`);
  }

  const data = await response.json();

  // Validate with Zod
  const validated = CachedMidtermDataSchema.parse(data);

  // Cache for future use
  midtermDataCache.set(year, validated);

  return validated;
}

interface UseMidtermDataResult {
  data: MidtermCountyVoting[] | null;
  loading: boolean;
  error: Error | null;
}

export function useMidtermData(year: MidtermYear): UseMidtermDataResult {
  const [data, setData] = useState<MidtermCountyVoting[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const midtermData = await loadMidtermData(year);
        if (!cancelled) {
          setData(midtermData);
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
export { midtermDataCache };
