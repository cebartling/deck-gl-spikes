import { useState, useEffect } from 'react';
import type { Earthquake, GeoJSONResponse, GeoJSONFeature } from '../types/earthquake';

export function transformGeoJSONFeature(feature: GeoJSONFeature): Earthquake {
  return {
    id: feature.id,
    longitude: feature.geometry.coordinates[0],
    latitude: feature.geometry.coordinates[1],
    depth: feature.geometry.coordinates[2],
    magnitude: feature.properties.mag,
    timestamp: feature.properties.time,
    location: feature.properties.place,
  };
}

export function useEarthquakeData(url: string) {
  const [data, setData] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json: GeoJSONResponse = await response.json();
        const earthquakes = json.features.map(transformGeoJSONFeature);

        if (!cancelled) {
          setData(earthquakes);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}
