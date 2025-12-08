import { create } from 'zustand';
import type { FilterMode } from '../types/flightFilter';

interface FlightFilterStore {
  selectedAirport: string | null; // IATA code
  filterMode: FilterMode;

  setSelectedAirport: (airportCode: string | null) => void;
  setFilterMode: (mode: FilterMode) => void;
  clearFilter: () => void;
  reset: () => void;
}

const initialState = {
  selectedAirport: null as string | null,
  filterMode: 'both' as FilterMode,
};

export const useFlightFilterStore = create<FlightFilterStore>((set) => ({
  ...initialState,

  setSelectedAirport: (airportCode) => {
    set({ selectedAirport: airportCode });
  },

  setFilterMode: (mode) => {
    set({ filterMode: mode });
  },

  clearFilter: () => {
    set({ selectedAirport: null });
  },

  reset: () => set(initialState),
}));
