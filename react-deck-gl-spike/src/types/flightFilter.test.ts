import { describe, it, expect } from 'vitest';
import { FilterModeSchema } from './flightFilter';

describe('FlightFilter types', () => {
  describe('FilterModeSchema', () => {
    it('accepts "origin"', () => {
      expect(FilterModeSchema.parse('origin')).toBe('origin');
    });

    it('accepts "destination"', () => {
      expect(FilterModeSchema.parse('destination')).toBe('destination');
    });

    it('accepts "both"', () => {
      expect(FilterModeSchema.parse('both')).toBe('both');
    });

    it('rejects invalid values', () => {
      expect(() => FilterModeSchema.parse('invalid')).toThrow();
    });

    it('rejects empty string', () => {
      expect(() => FilterModeSchema.parse('')).toThrow();
    });

    it('rejects null', () => {
      expect(() => FilterModeSchema.parse(null)).toThrow();
    });
  });
});
