import { useMemo, useState, useCallback } from 'react';
import Fuse from 'fuse.js';
import type { Airport } from '../../../types/flight';

interface UseAirportSearchResult {
  searchResults: Airport[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

export function useAirportSearch(airports: Airport[]): UseAirportSearchResult {
  const [searchQuery, setSearchQuery] = useState('');

  // Create fuzzy search index
  const fuse = useMemo(() => {
    return new Fuse(airports, {
      keys: [
        { name: 'code', weight: 2 }, // IATA code weighted higher
        { name: 'name', weight: 1.5 },
        { name: 'city', weight: 1 },
        { name: 'country', weight: 0.5 },
      ],
      threshold: 0.3, // Fuzzy match threshold
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [airports]);

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) {
      // Return top airports by default (sorted alphabetically by code)
      return airports.slice(0, 10);
    }

    const results = fuse.search(searchQuery);
    return results.slice(0, 10).map((result) => result.item);
  }, [fuse, searchQuery, airports]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchResults,
    searchQuery,
    setSearchQuery,
    clearSearch,
  };
}
