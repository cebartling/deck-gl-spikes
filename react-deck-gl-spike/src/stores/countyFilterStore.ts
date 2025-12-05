import { create } from 'zustand';
import type { ElectionYear } from '../types/election';
import type { MidtermYear } from '../types/midterm';
import type { ElectionType } from '../types/electionType';

interface CountyFilterStore {
  /** Selected state FIPS code, null means all states */
  selectedState: string | null;
  /** Election type: presidential or midterm */
  electionType: ElectionType;
  /** Selected presidential election year */
  selectedPresidentialYear: ElectionYear;
  /** Selected midterm election year */
  selectedMidtermYear: MidtermYear;

  /** Actions */
  setSelectedState: (stateFips: string | null) => void;
  setElectionType: (type: ElectionType) => void;
  setSelectedPresidentialYear: (year: ElectionYear) => void;
  setSelectedMidtermYear: (year: MidtermYear) => void;
  reset: () => void;
}

export const useCountyFilterStore = create<CountyFilterStore>((set) => ({
  selectedState: null,
  electionType: 'presidential',
  selectedPresidentialYear: 2024,
  selectedMidtermYear: 2022,

  setSelectedState: (stateFips) => {
    set({ selectedState: stateFips });
  },

  setElectionType: (type) => {
    set({ electionType: type });
  },

  setSelectedPresidentialYear: (year) => {
    set({ selectedPresidentialYear: year });
  },

  setSelectedMidtermYear: (year) => {
    set({ selectedMidtermYear: year });
  },

  reset: () => {
    set({
      selectedState: null,
      electionType: 'presidential',
      selectedPresidentialYear: 2024,
      selectedMidtermYear: 2022,
    });
  },
}));
