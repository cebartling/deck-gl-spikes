import { create } from 'zustand';
import {
  GeoJSONResponseSchema,
  type Earthquake,
  type GeoJSONFeature,
} from '../types/earthquake';

export function transformGeoJSONFeature(feature: GeoJSONFeature): Earthquake {
  return {
    id: feature.id,
    longitude: feature.geometry.coordinates[0],
    latitude: feature.geometry.coordinates[1],
    depth: feature.geometry.coordinates[2],
    magnitude: feature.properties.mag ?? 0,
    timestamp: new Date(feature.properties.time).toISOString(),
    location: feature.properties.place ?? 'Unknown location',
  };
}

interface EarthquakeState {
  earthquakes: Earthquake[];
  loading: boolean;
  error: Error | null;
  lastFetchedUrl: string | null;

  // Actions
  fetchEarthquakes: (url: string) => Promise<void>;
  setEarthquakes: (earthquakes: Earthquake[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  earthquakes: [],
  loading: false,
  error: null,
  lastFetchedUrl: null,
};

export const useEarthquakeStore = create<EarthquakeState>((set, get) => ({
  ...initialState,

  fetchEarthquakes: async (url: string) => {
    // Skip if already fetching the same URL
    if (get().loading && get().lastFetchedUrl === url) {
      return;
    }

    set({ loading: true, error: null, lastFetchedUrl: url });

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      // Validate the API response with Zod
      const validatedResponse = GeoJSONResponseSchema.parse(json);
      const earthquakes = validatedResponse.features.map(transformGeoJSONFeature);

      set({ earthquakes, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err : new Error('Unknown error'),
        loading: false,
      });
    }
  },

  setEarthquakes: (earthquakes) => set({ earthquakes }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}));
