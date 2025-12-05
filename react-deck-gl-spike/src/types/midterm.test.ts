import { describe, it, expect } from 'vitest';
import {
  MIDTERM_YEARS,
  MIDTERM_YEAR_INFO,
  MidtermCountyVotingSchema,
  CachedMidtermDataSchema,
} from './midterm';

describe('midterm types', () => {
  describe('MIDTERM_YEARS', () => {
    it('should contain all valid midterm years', () => {
      expect(MIDTERM_YEARS).toContain(2022);
      expect(MIDTERM_YEARS).toContain(2018);
      expect(MIDTERM_YEARS).toContain(2014);
      expect(MIDTERM_YEARS).toContain(2010);
    });

    it('should have exactly 4 midterm years', () => {
      expect(MIDTERM_YEARS).toHaveLength(4);
    });

    it('should be in descending order', () => {
      for (let i = 0; i < MIDTERM_YEARS.length - 1; i++) {
        expect(MIDTERM_YEARS[i]).toBeGreaterThan(MIDTERM_YEARS[i + 1]);
      }
    });
  });

  describe('MIDTERM_YEAR_INFO', () => {
    it('should have info for all midterm years', () => {
      for (const year of MIDTERM_YEARS) {
        expect(MIDTERM_YEAR_INFO[year]).toBeDefined();
        expect(MIDTERM_YEAR_INFO[year].year).toBe(year);
        expect(MIDTERM_YEAR_INFO[year].label).toBeDefined();
        expect(MIDTERM_YEAR_INFO[year].description).toBeDefined();
      }
    });

    it('should have House & Senate in all descriptions', () => {
      for (const year of MIDTERM_YEARS) {
        expect(MIDTERM_YEAR_INFO[year].description).toContain('House');
        expect(MIDTERM_YEAR_INFO[year].description).toContain('Senate');
      }
    });
  });

  describe('MidtermCountyVotingSchema', () => {
    it('should validate a valid county voting record', () => {
      const validRecord = {
        fips: '01001',
        name: 'Autauga',
        state: 'AL',
        stateFips: '01',
        totalVotes: 24500,
        democratVotes: 5800,
        republicanVotes: 18200,
        otherVotes: 500,
        margin: -12400,
        marginPercent: -50.61,
      };

      const result = MidtermCountyVotingSchema.safeParse(validRecord);
      expect(result.success).toBe(true);
    });

    it('should validate with optional midterm-specific fields', () => {
      const validRecord = {
        fips: '01001',
        name: 'Autauga',
        state: 'AL',
        stateFips: '01',
        totalVotes: 24500,
        democratVotes: 5800,
        republicanVotes: 18200,
        otherVotes: 500,
        margin: -12400,
        marginPercent: -50.61,
        houseRaces: 1,
        senateRace: true,
      };

      const result = MidtermCountyVotingSchema.safeParse(validRecord);
      expect(result.success).toBe(true);
    });

    it('should reject record missing required fields', () => {
      const invalidRecord = {
        fips: '01001',
        name: 'Autauga',
        // Missing other required fields
      };

      const result = MidtermCountyVotingSchema.safeParse(invalidRecord);
      expect(result.success).toBe(false);
    });

    it('should reject record with invalid types', () => {
      const invalidRecord = {
        fips: '01001',
        name: 'Autauga',
        state: 'AL',
        stateFips: '01',
        totalVotes: 'not a number', // Should be number
        democratVotes: 5800,
        republicanVotes: 18200,
        otherVotes: 500,
        margin: -12400,
        marginPercent: -50.61,
      };

      const result = MidtermCountyVotingSchema.safeParse(invalidRecord);
      expect(result.success).toBe(false);
    });
  });

  describe('CachedMidtermDataSchema', () => {
    it('should validate an array of county voting records', () => {
      const validData = [
        {
          fips: '01001',
          name: 'Autauga',
          state: 'AL',
          stateFips: '01',
          totalVotes: 24500,
          democratVotes: 5800,
          republicanVotes: 18200,
          otherVotes: 500,
          margin: -12400,
          marginPercent: -50.61,
        },
        {
          fips: '01003',
          name: 'Baldwin',
          state: 'AL',
          stateFips: '01',
          totalVotes: 98000,
          democratVotes: 22000,
          republicanVotes: 75000,
          otherVotes: 1000,
          margin: -53000,
          marginPercent: -54.08,
        },
      ];

      const result = CachedMidtermDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate an empty array', () => {
      const result = CachedMidtermDataSchema.safeParse([]);
      expect(result.success).toBe(true);
    });

    it('should reject non-array data', () => {
      const result = CachedMidtermDataSchema.safeParse({ data: [] });
      expect(result.success).toBe(false);
    });
  });
});
