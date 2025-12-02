import { useMemo } from 'react';
import type { Earthquake } from '../../../types/earthquake';
import type { FilterState } from '../../../types/filters';
import { filterByDateRange } from '../../../utils/filterEarthquakes';

/**
 * Hook to filter earthquakes based on current filter state.
 * Memoizes the result to avoid unnecessary recalculations.
 */
export function useFilteredEarthquakes(
  earthquakes: Earthquake[],
  filters: FilterState
): Earthquake[] {
  return useMemo(() => {
    let filtered = earthquakes;

    // Apply date range filter
    filtered = filterByDateRange(filtered, filters.dateRange);

    // Future: Apply additional filters
    // filtered = filterByMagnitude(filtered, filters.magnitudeRange);
    // filtered = filterByDepth(filtered, filters.depthRange);

    return filtered;
  }, [earthquakes, filters]);
}
