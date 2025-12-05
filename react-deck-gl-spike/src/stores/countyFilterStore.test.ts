import { describe, it, expect, beforeEach } from 'vitest';
import { useCountyFilterStore } from './countyFilterStore';

describe('countyFilterStore', () => {
  beforeEach(() => {
    useCountyFilterStore.getState().reset();
  });

  describe('initial state', () => {
    it('should have null selectedState initially', () => {
      const state = useCountyFilterStore.getState();
      expect(state.selectedState).toBeNull();
    });

    it('should have presidential as initial electionType', () => {
      const state = useCountyFilterStore.getState();
      expect(state.electionType).toBe('presidential');
    });

    it('should have 2024 as initial selectedPresidentialYear', () => {
      const state = useCountyFilterStore.getState();
      expect(state.selectedPresidentialYear).toBe(2024);
    });

    it('should have 2022 as initial selectedMidtermYear', () => {
      const state = useCountyFilterStore.getState();
      expect(state.selectedMidtermYear).toBe(2022);
    });
  });

  describe('setSelectedState', () => {
    it('should set selectedState to a FIPS code', () => {
      useCountyFilterStore.getState().setSelectedState('06');
      expect(useCountyFilterStore.getState().selectedState).toBe('06');
    });

    it('should set selectedState to null for all states', () => {
      useCountyFilterStore.getState().setSelectedState('06');
      useCountyFilterStore.getState().setSelectedState(null);
      expect(useCountyFilterStore.getState().selectedState).toBeNull();
    });

    it('should allow changing to a different state', () => {
      useCountyFilterStore.getState().setSelectedState('06');
      useCountyFilterStore.getState().setSelectedState('48');
      expect(useCountyFilterStore.getState().selectedState).toBe('48');
    });
  });

  describe('setElectionType', () => {
    it('should set electionType to midterm', () => {
      useCountyFilterStore.getState().setElectionType('midterm');
      expect(useCountyFilterStore.getState().electionType).toBe('midterm');
    });

    it('should allow changing back to presidential', () => {
      useCountyFilterStore.getState().setElectionType('midterm');
      useCountyFilterStore.getState().setElectionType('presidential');
      expect(useCountyFilterStore.getState().electionType).toBe('presidential');
    });
  });

  describe('setSelectedPresidentialYear', () => {
    it('should set selectedPresidentialYear to a valid election year', () => {
      useCountyFilterStore.getState().setSelectedPresidentialYear(2020);
      expect(useCountyFilterStore.getState().selectedPresidentialYear).toBe(
        2020
      );
    });

    it('should allow changing to a different year', () => {
      useCountyFilterStore.getState().setSelectedPresidentialYear(2020);
      useCountyFilterStore.getState().setSelectedPresidentialYear(2016);
      expect(useCountyFilterStore.getState().selectedPresidentialYear).toBe(
        2016
      );
    });

    it('should accept all valid election years', () => {
      const years = [2008, 2012, 2016, 2020, 2024] as const;
      for (const year of years) {
        useCountyFilterStore.getState().setSelectedPresidentialYear(year);
        expect(useCountyFilterStore.getState().selectedPresidentialYear).toBe(
          year
        );
      }
    });
  });

  describe('setSelectedMidtermYear', () => {
    it('should set selectedMidtermYear to a valid midterm year', () => {
      useCountyFilterStore.getState().setSelectedMidtermYear(2018);
      expect(useCountyFilterStore.getState().selectedMidtermYear).toBe(2018);
    });

    it('should allow changing to a different year', () => {
      useCountyFilterStore.getState().setSelectedMidtermYear(2018);
      useCountyFilterStore.getState().setSelectedMidtermYear(2014);
      expect(useCountyFilterStore.getState().selectedMidtermYear).toBe(2014);
    });

    it('should accept all valid midterm years', () => {
      const years = [2010, 2014, 2018, 2022] as const;
      for (const year of years) {
        useCountyFilterStore.getState().setSelectedMidtermYear(year);
        expect(useCountyFilterStore.getState().selectedMidtermYear).toBe(year);
      }
    });
  });

  describe('reset', () => {
    it('should reset selectedState to null', () => {
      useCountyFilterStore.getState().setSelectedState('06');
      useCountyFilterStore.getState().reset();
      expect(useCountyFilterStore.getState().selectedState).toBeNull();
    });

    it('should reset electionType to presidential', () => {
      useCountyFilterStore.getState().setElectionType('midterm');
      useCountyFilterStore.getState().reset();
      expect(useCountyFilterStore.getState().electionType).toBe('presidential');
    });

    it('should reset selectedPresidentialYear to 2024', () => {
      useCountyFilterStore.getState().setSelectedPresidentialYear(2016);
      useCountyFilterStore.getState().reset();
      expect(useCountyFilterStore.getState().selectedPresidentialYear).toBe(
        2024
      );
    });

    it('should reset selectedMidtermYear to 2022', () => {
      useCountyFilterStore.getState().setSelectedMidtermYear(2014);
      useCountyFilterStore.getState().reset();
      expect(useCountyFilterStore.getState().selectedMidtermYear).toBe(2022);
    });

    it('should reset all filters', () => {
      useCountyFilterStore.getState().setSelectedState('06');
      useCountyFilterStore.getState().setElectionType('midterm');
      useCountyFilterStore.getState().setSelectedPresidentialYear(2016);
      useCountyFilterStore.getState().setSelectedMidtermYear(2014);
      useCountyFilterStore.getState().reset();
      expect(useCountyFilterStore.getState().selectedState).toBeNull();
      expect(useCountyFilterStore.getState().electionType).toBe('presidential');
      expect(useCountyFilterStore.getState().selectedPresidentialYear).toBe(
        2024
      );
      expect(useCountyFilterStore.getState().selectedMidtermYear).toBe(2022);
    });
  });
});
