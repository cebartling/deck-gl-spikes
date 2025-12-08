import { useMemo } from 'react';
import type { FlightRoute, Airport } from '../../../types/flight';
import type { FilteredRoutesStats } from '../../../types/flightFilter';
import { useFlightFilterStore } from '../../../stores/flightFilterStore';

interface UseFilteredRoutesResult {
  filteredRoutes: FlightRoute[];
  stats: FilteredRoutesStats;
  isFiltered: boolean;
  selectedAirportData: Airport | null;
}

export function useFilteredRoutes(
  routes: FlightRoute[]
): UseFilteredRoutesResult {
  const selectedAirport = useFlightFilterStore(
    (state) => state.selectedAirport
  );
  const filterMode = useFlightFilterStore((state) => state.filterMode);

  const filteredRoutes = useMemo(() => {
    if (!selectedAirport) {
      return routes;
    }

    return routes.filter((route) => {
      switch (filterMode) {
        case 'origin':
          return route.origin.code === selectedAirport;
        case 'destination':
          return route.destination.code === selectedAirport;
        case 'both':
        default:
          return (
            route.origin.code === selectedAirport ||
            route.destination.code === selectedAirport
          );
      }
    });
  }, [routes, selectedAirport, filterMode]);

  const stats = useMemo((): FilteredRoutesStats => {
    const connectedAirports = new Set<string>();

    filteredRoutes.forEach((route) => {
      connectedAirports.add(route.origin.code);
      connectedAirports.add(route.destination.code);
    });

    return {
      totalRoutes: filteredRoutes.length,
      totalFlights: filteredRoutes.reduce((sum, r) => sum + r.frequency, 0),
      connectedAirports: connectedAirports.size,
    };
  }, [filteredRoutes]);

  const selectedAirportData = useMemo((): Airport | null => {
    if (!selectedAirport) return null;

    for (const route of routes) {
      if (route.origin.code === selectedAirport) {
        return route.origin;
      }
      if (route.destination.code === selectedAirport) {
        return route.destination;
      }
    }

    return null;
  }, [routes, selectedAirport]);

  return {
    filteredRoutes,
    stats,
    isFiltered: selectedAirport !== null,
    selectedAirportData,
  };
}
