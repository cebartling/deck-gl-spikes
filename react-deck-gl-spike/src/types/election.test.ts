import { describe, it, expect } from 'vitest';
import { ELECTION_YEARS, ELECTION_YEAR_INFO } from './election';
import type { ElectionYear } from './election';

describe('election types', () => {
  describe('ELECTION_YEARS', () => {
    it('should contain all valid election years', () => {
      expect(ELECTION_YEARS).toContain(2024);
      expect(ELECTION_YEARS).toContain(2020);
      expect(ELECTION_YEARS).toContain(2016);
      expect(ELECTION_YEARS).toContain(2012);
      expect(ELECTION_YEARS).toContain(2008);
    });

    it('should have 5 election years', () => {
      expect(ELECTION_YEARS).toHaveLength(5);
    });

    it('should be sorted in descending order', () => {
      const sorted = [...ELECTION_YEARS].sort((a, b) => b - a);
      expect(ELECTION_YEARS).toEqual(sorted);
    });
  });

  describe('ELECTION_YEAR_INFO', () => {
    it('should have info for all election years', () => {
      for (const year of ELECTION_YEARS) {
        expect(ELECTION_YEAR_INFO[year]).toBeDefined();
      }
    });

    it('should have correct structure for each year', () => {
      for (const year of ELECTION_YEARS) {
        const info = ELECTION_YEAR_INFO[year];
        expect(info.year).toBe(year);
        expect(info.label).toBe(year.toString());
        expect(typeof info.description).toBe('string');
        expect(info.description.length).toBeGreaterThan(0);
      }
    });

    it('should have correct descriptions for each year', () => {
      expect(ELECTION_YEAR_INFO[2024].description).toBe('Harris vs Trump');
      expect(ELECTION_YEAR_INFO[2020].description).toBe('Biden vs Trump');
      expect(ELECTION_YEAR_INFO[2016].description).toBe('Clinton vs Trump');
      expect(ELECTION_YEAR_INFO[2012].description).toBe('Obama vs Romney');
      expect(ELECTION_YEAR_INFO[2008].description).toBe('Obama vs McCain');
    });
  });

  describe('ElectionYear type', () => {
    it('should only accept valid election years', () => {
      const validYears: ElectionYear[] = [2008, 2012, 2016, 2020, 2024];
      expect(validYears).toHaveLength(5);
    });
  });
});
