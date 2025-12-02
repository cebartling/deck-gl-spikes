import { useState, useCallback } from 'react';
import type { DateRange, FilterState } from '../../../types/filters';

const INITIAL_FILTER_STATE: FilterState = {
  dateRange: {
    startDate: null,
    endDate: null,
  },
};

export function useFilterState() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);

  const setDateRange = useCallback((dateRange: DateRange) => {
    setFilters((prev) => ({ ...prev, dateRange }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTER_STATE);
  }, []);

  return {
    filters,
    setDateRange,
    resetFilters,
  };
}
