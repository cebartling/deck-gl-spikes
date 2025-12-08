import { z } from 'zod';

export const FilterModeSchema = z.enum(['origin', 'destination', 'both']);
export type FilterMode = z.infer<typeof FilterModeSchema>;

export interface FlightFilterState {
  selectedAirport: string | null; // Airport IATA code
  filterMode: FilterMode;
}

export interface FilteredRoutesStats {
  totalRoutes: number;
  totalFlights: number;
  connectedAirports: number;
}
