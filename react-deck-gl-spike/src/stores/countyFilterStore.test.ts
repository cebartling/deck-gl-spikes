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

  describe('reset', () => {
    it('should reset selectedState to null', () => {
      useCountyFilterStore.getState().setSelectedState('06');
      useCountyFilterStore.getState().reset();
      expect(useCountyFilterStore.getState().selectedState).toBeNull();
    });
  });
});
