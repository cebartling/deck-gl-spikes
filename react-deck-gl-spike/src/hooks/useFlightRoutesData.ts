import { useEffect, useCallback } from 'react';
import { useFlightRoutesStore } from '../stores/flightRoutesStore';

const FLIGHT_ROUTES_URL = '/data/flight-routes.json';

export function useFlightRoutesData(url: string = FLIGHT_ROUTES_URL) {
  const routes = useFlightRoutesStore((state) => state.routes);
  const airports = useFlightRoutesStore((state) => state.airports);
  const loading = useFlightRoutesStore((state) => state.loading);
  const error = useFlightRoutesStore((state) => state.error);
  const fetchRoutes = useFlightRoutesStore((state) => state.fetchRoutes);

  const refetch = useCallback(() => {
    fetchRoutes(url);
  }, [fetchRoutes, url]);

  useEffect(() => {
    if (routes.length === 0 && !loading && !error) {
      fetchRoutes(url);
    }
  }, [routes.length, loading, error, fetchRoutes, url]);

  return {
    routes,
    airports,
    loading,
    error,
    refetch,
  };
}
