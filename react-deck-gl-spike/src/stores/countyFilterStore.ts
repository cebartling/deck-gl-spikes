import { create } from 'zustand';
import type { ElectionYear } from '../types/election';

interface CountyFilterStore {
  /** Selected state FIPS code, null means all states */
  selectedState: string | null;
  /** Selected election year */
  selectedYear: ElectionYear;

  /** Actions */
  setSelectedState: (stateFips: string | null) => void;
  setSelectedYear: (year: ElectionYear) => void;
  reset: () => void;
}

export const useCountyFilterStore = create<CountyFilterStore>((set) => ({
  selectedState: null,
  selectedYear: 2024,

  setSelectedState: (stateFips) => {
    set({ selectedState: stateFips });
  },

  setSelectedYear: (year) => {
    set({ selectedYear: year });
  },

  reset: () => {
    set({ selectedState: null, selectedYear: 2024 });
  },
}));
