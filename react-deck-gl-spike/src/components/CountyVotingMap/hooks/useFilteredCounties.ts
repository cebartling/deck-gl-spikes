import { useMemo } from 'react';
import type { CountyFeatureCollection } from '../../../types/county';
import { useCountyFilterStore } from '../../../stores/countyFilterStore';

export interface FilterStats {
  countyCount: number;
  totalVotes: number;
  democratVotes: number;
  republicanVotes: number;
  overallMargin: number;
}

export interface FilteredCountiesResult {
  filteredData: CountyFeatureCollection | null;
  stats: FilterStats | null;
  isFiltered: boolean;
}

export function useFilteredCounties(
  data: CountyFeatureCollection | null
): FilteredCountiesResult {
  const selectedState = useCountyFilterStore((state) => state.selectedState);

  const filteredData = useMemo(() => {
    if (!data) return null;

    // If no state filter, return all counties
    if (!selectedState) {
      return data;
    }

    // Filter counties by state FIPS
    const filteredFeatures = data.features.filter(
      (feature) => feature.properties.stateFips === selectedState
    );

    return {
      type: 'FeatureCollection' as const,
      features: filteredFeatures,
    };
  }, [data, selectedState]);

  const stats = useMemo((): FilterStats | null => {
    if (!filteredData) return null;

    const counties = filteredData.features;

    if (counties.length === 0) {
      return {
        countyCount: 0,
        totalVotes: 0,
        democratVotes: 0,
        republicanVotes: 0,
        overallMargin: 0,
      };
    }

    const totalVotes = counties.reduce(
      (sum, f) => sum + f.properties.totalVotes,
      0
    );
    const democratVotes = counties.reduce(
      (sum, f) => sum + f.properties.democratVotes,
      0
    );
    const republicanVotes = counties.reduce(
      (sum, f) => sum + f.properties.republicanVotes,
      0
    );

    const overallMargin =
      totalVotes > 0
        ? ((democratVotes - republicanVotes) / totalVotes) * 100
        : 0;

    return {
      countyCount: counties.length,
      totalVotes,
      democratVotes,
      republicanVotes,
      overallMargin,
    };
  }, [filteredData]);

  return {
    filteredData,
    stats,
    isFiltered: selectedState !== null,
  };
}
