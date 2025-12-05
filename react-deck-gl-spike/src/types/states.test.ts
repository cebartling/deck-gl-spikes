import { describe, it, expect } from 'vitest';
import {
  US_STATES,
  STATE_CENTERS,
  getStateNameByFips,
  getStateCenterByFips,
} from './states';

describe('states', () => {
  describe('US_STATES', () => {
    it('should contain 51 entries (50 states + DC)', () => {
      expect(US_STATES).toHaveLength(51);
    });

    it('should have all required properties for each state', () => {
      US_STATES.forEach((state) => {
        expect(state).toHaveProperty('code');
        expect(state).toHaveProperty('name');
        expect(state).toHaveProperty('fips');
        expect(state.code).toHaveLength(2);
        expect(state.fips).toHaveLength(2);
        expect(state.name.length).toBeGreaterThan(0);
      });
    });

    it('should have unique FIPS codes', () => {
      const fipsCodes = US_STATES.map((s) => s.fips);
      const uniqueFips = new Set(fipsCodes);
      expect(uniqueFips.size).toBe(US_STATES.length);
    });

    it('should have unique state codes', () => {
      const stateCodes = US_STATES.map((s) => s.code);
      const uniqueCodes = new Set(stateCodes);
      expect(uniqueCodes.size).toBe(US_STATES.length);
    });

    it('should include California with correct data', () => {
      const california = US_STATES.find((s) => s.code === 'CA');
      expect(california).toEqual({
        code: 'CA',
        name: 'California',
        fips: '06',
      });
    });

    it('should include Texas with correct data', () => {
      const texas = US_STATES.find((s) => s.code === 'TX');
      expect(texas).toEqual({
        code: 'TX',
        name: 'Texas',
        fips: '48',
      });
    });

    it('should include District of Columbia', () => {
      const dc = US_STATES.find((s) => s.code === 'DC');
      expect(dc).toEqual({
        code: 'DC',
        name: 'District of Columbia',
        fips: '11',
      });
    });
  });

  describe('STATE_CENTERS', () => {
    it('should have center coordinates for all 51 states', () => {
      expect(Object.keys(STATE_CENTERS)).toHaveLength(51);
    });

    it('should have valid coordinates for each state', () => {
      Object.entries(STATE_CENTERS).forEach(([_fips, center]) => {
        expect(center).toHaveProperty('longitude');
        expect(center).toHaveProperty('latitude');
        expect(center).toHaveProperty('zoom');
        expect(center.longitude).toBeGreaterThanOrEqual(-180);
        expect(center.longitude).toBeLessThanOrEqual(180);
        expect(center.latitude).toBeGreaterThanOrEqual(-90);
        expect(center.latitude).toBeLessThanOrEqual(90);
        expect(center.zoom).toBeGreaterThan(0);
        expect(center.zoom).toBeLessThanOrEqual(15);
      });
    });

    it('should have center for California', () => {
      expect(STATE_CENTERS['06']).toEqual({
        longitude: -119.4179,
        latitude: 36.7783,
        zoom: 5,
      });
    });

    it('should have center for Texas', () => {
      expect(STATE_CENTERS['48']).toEqual({
        longitude: -99.9018,
        latitude: 31.9686,
        zoom: 5,
      });
    });

    it('should have higher zoom for small states', () => {
      // Rhode Island should have higher zoom than Texas
      expect(STATE_CENTERS['44'].zoom).toBeGreaterThan(STATE_CENTERS['48'].zoom);
    });

    it('should have lower zoom for Alaska', () => {
      // Alaska should have lower zoom due to its size
      expect(STATE_CENTERS['02'].zoom).toBeLessThanOrEqual(4);
    });
  });

  describe('getStateNameByFips', () => {
    it('should return state name for valid FIPS code', () => {
      expect(getStateNameByFips('06')).toBe('California');
      expect(getStateNameByFips('48')).toBe('Texas');
      expect(getStateNameByFips('36')).toBe('New York');
    });

    it('should return undefined for invalid FIPS code', () => {
      expect(getStateNameByFips('99')).toBeUndefined();
      expect(getStateNameByFips('')).toBeUndefined();
      expect(getStateNameByFips('invalid')).toBeUndefined();
    });

    it('should return correct name for DC', () => {
      expect(getStateNameByFips('11')).toBe('District of Columbia');
    });
  });

  describe('getStateCenterByFips', () => {
    it('should return center coordinates for valid FIPS code', () => {
      const center = getStateCenterByFips('06');
      expect(center).toBeDefined();
      expect(center?.longitude).toBe(-119.4179);
      expect(center?.latitude).toBe(36.7783);
      expect(center?.zoom).toBe(5);
    });

    it('should return undefined for invalid FIPS code', () => {
      expect(getStateCenterByFips('99')).toBeUndefined();
      expect(getStateCenterByFips('')).toBeUndefined();
      expect(getStateCenterByFips('invalid')).toBeUndefined();
    });

    it('should return center for all valid state FIPS codes', () => {
      US_STATES.forEach((state) => {
        const center = getStateCenterByFips(state.fips);
        expect(center).toBeDefined();
      });
    });
  });
});
