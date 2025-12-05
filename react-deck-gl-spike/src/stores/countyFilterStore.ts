import { create } from 'zustand';

interface CountyFilterStore {
  /** Selected state FIPS code, null means all states */
  selectedState: string | null;

  /** Actions */
  setSelectedState: (stateFips: string | null) => void;
  reset: () => void;
}

export const useCountyFilterStore = create<CountyFilterStore>((set) => ({
  selectedState: null,

  setSelectedState: (stateFips) => {
    set({ selectedState: stateFips });
  },

  reset: () => {
    set({ selectedState: null });
  },
}));
