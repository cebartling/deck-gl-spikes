import { create } from 'zustand';
import {
  FlightRoutesResponseSchema,
  type FlightRoute,
  type Airport,
} from '../types/flight';

interface FlightRoutesState {
  routes: FlightRoute[];
  airports: Map<string, Airport>;
  loading: boolean;
  error: Error | null;
  lastFetchedUrl: string | null;

  // Actions
  fetchRoutes: (url: string) => Promise<void>;
  setRoutes: (routes: FlightRoute[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  routes: [],
  airports: new Map<string, Airport>(),
  loading: false,
  error: null,
  lastFetchedUrl: null,
};

export const useFlightRoutesStore = create<FlightRoutesState>((set, get) => ({
  ...initialState,

  fetchRoutes: async (url: string) => {
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
      const validatedResponse = FlightRoutesResponseSchema.parse(json);

      // Extract unique airports from routes
      const airports = new Map<string, Airport>();
      validatedResponse.routes.forEach((route) => {
        airports.set(route.origin.code, route.origin);
        airports.set(route.destination.code, route.destination);
      });

      set({
        routes: validatedResponse.routes,
        airports,
        loading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err : new Error('Unknown error'),
        loading: false,
      });
    }
  },

  setRoutes: (routes) => {
    // Extract unique airports from routes
    const airports = new Map<string, Airport>();
    routes.forEach((route) => {
      airports.set(route.origin.code, route.origin);
      airports.set(route.destination.code, route.destination);
    });
    set({ routes, airports });
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}));
