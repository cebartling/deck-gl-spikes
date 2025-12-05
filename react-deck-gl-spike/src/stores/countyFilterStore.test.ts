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

    it('should have 2024 as initial selectedYear', () => {
      const state = useCountyFilterStore.getState();
      expect(state.selectedYear).toBe(2024);
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

  describe('setSelectedYear', () => {
    it('should set selectedYear to a valid election year', () => {
      useCountyFilterStore.getState().setSelectedYear(2020);
      expect(useCountyFilterStore.getState().selectedYear).toBe(2020);
    });

    it('should allow changing to a different year', () => {
      useCountyFilterStore.getState().setSelectedYear(2020);
      useCountyFilterStore.getState().setSelectedYear(2016);
      expect(useCountyFilterStore.getState().selectedYear).toBe(2016);
    });

    it('should accept all valid election years', () => {
      const years = [2008, 2012, 2016, 2020, 2024] as const;
      for (const year of years) {
        useCountyFilterStore.getState().setSelectedYear(year);
        expect(useCountyFilterStore.getState().selectedYear).toBe(year);
      }
    });
  });

  describe('reset', () => {
    it('should reset selectedState to null', () => {
      useCountyFilterStore.getState().setSelectedState('06');
      useCountyFilterStore.getState().reset();
      expect(useCountyFilterStore.getState().selectedState).toBeNull();
    });

    it('should reset selectedYear to 2024', () => {
      useCountyFilterStore.getState().setSelectedYear(2016);
      useCountyFilterStore.getState().reset();
      expect(useCountyFilterStore.getState().selectedYear).toBe(2024);
    });

    it('should reset both state and year filters', () => {
      useCountyFilterStore.getState().setSelectedState('06');
      useCountyFilterStore.getState().setSelectedYear(2016);
      useCountyFilterStore.getState().reset();
      expect(useCountyFilterStore.getState().selectedState).toBeNull();
      expect(useCountyFilterStore.getState().selectedYear).toBe(2024);
    });
  });
});
