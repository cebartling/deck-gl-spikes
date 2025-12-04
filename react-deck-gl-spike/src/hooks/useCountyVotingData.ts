import { useState, useEffect } from 'react';
import type { CountyFeatureCollection } from '../types/county';

// Mock county data with simplified geometries for demonstration
const MOCK_COUNTY_DATA: CountyFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        fips: '06001',
        name: 'Alameda',
        state: 'CA',
        stateFips: '06',
        totalVotes: 500000,
        democratVotes: 350000,
        republicanVotes: 130000,
        otherVotes: 20000,
        margin: 220000,
        marginPercent: 44,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.3, 37.5],
            [-122.1, 37.5],
            [-122.1, 37.8],
            [-122.3, 37.8],
            [-122.3, 37.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        fips: '06075',
        name: 'San Francisco',
        state: 'CA',
        stateFips: '06',
        totalVotes: 400000,
        democratVotes: 340000,
        republicanVotes: 50000,
        otherVotes: 10000,
        margin: 290000,
        marginPercent: 72.5,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.5, 37.7],
            [-122.35, 37.7],
            [-122.35, 37.85],
            [-122.5, 37.85],
            [-122.5, 37.7],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        fips: '48201',
        name: 'Harris',
        state: 'TX',
        stateFips: '48',
        totalVotes: 1500000,
        democratVotes: 700000,
        republicanVotes: 780000,
        otherVotes: 20000,
        margin: -80000,
        marginPercent: -5.3,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-95.8, 29.5],
            [-95.0, 29.5],
            [-95.0, 30.2],
            [-95.8, 30.2],
            [-95.8, 29.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        fips: '48113',
        name: 'Dallas',
        state: 'TX',
        stateFips: '48',
        totalVotes: 1000000,
        democratVotes: 520000,
        republicanVotes: 460000,
        otherVotes: 20000,
        margin: 60000,
        marginPercent: 6,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-97.0, 32.6],
            [-96.5, 32.6],
            [-96.5, 33.0],
            [-97.0, 33.0],
            [-97.0, 32.6],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        fips: '12086',
        name: 'Miami-Dade',
        state: 'FL',
        stateFips: '12',
        totalVotes: 1100000,
        democratVotes: 530000,
        republicanVotes: 550000,
        otherVotes: 20000,
        margin: -20000,
        marginPercent: -1.8,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.9, 25.2],
            [-80.1, 25.2],
            [-80.1, 25.9],
            [-80.9, 25.9],
            [-80.9, 25.2],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        fips: '36061',
        name: 'New York',
        state: 'NY',
        stateFips: '36',
        totalVotes: 900000,
        democratVotes: 750000,
        republicanVotes: 130000,
        otherVotes: 20000,
        margin: 620000,
        marginPercent: 68.9,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.05, 40.68],
            [-73.9, 40.68],
            [-73.9, 40.88],
            [-74.05, 40.88],
            [-74.05, 40.68],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        fips: '17031',
        name: 'Cook',
        state: 'IL',
        stateFips: '17',
        totalVotes: 2200000,
        democratVotes: 1540000,
        republicanVotes: 620000,
        otherVotes: 40000,
        margin: 920000,
        marginPercent: 41.8,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-88.3, 41.5],
            [-87.5, 41.5],
            [-87.5, 42.2],
            [-88.3, 42.2],
            [-88.3, 41.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        fips: '04013',
        name: 'Maricopa',
        state: 'AZ',
        stateFips: '04',
        totalVotes: 2000000,
        democratVotes: 1010000,
        republicanVotes: 970000,
        otherVotes: 20000,
        margin: 40000,
        marginPercent: 2,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-113.5, 32.5],
            [-111.0, 32.5],
            [-111.0, 34.0],
            [-113.5, 34.0],
            [-113.5, 32.5],
          ],
        ],
      },
    },
  ],
};

interface UseCountyVotingDataResult {
  data: CountyFeatureCollection | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch county voting data.
 * Currently returns mock data for demonstration purposes.
 *
 * In production, this would fetch from:
 * - County boundaries GeoJSON (e.g., US Census Bureau)
 * - Voting results API (e.g., MIT Election Lab)
 */
export function useCountyVotingData(): UseCountyVotingDataResult {
  const [data, setData] = useState<CountyFeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate async data loading
    const timer = setTimeout(() => {
      try {
        setData(MOCK_COUNTY_DATA);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'));
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { data, loading, error };
}
