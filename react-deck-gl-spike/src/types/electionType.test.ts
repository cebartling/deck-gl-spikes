import { describe, it, expect } from 'vitest';
import { ELECTION_TYPES } from './electionType';
import type { ElectionType } from './electionType';

describe('electionType types', () => {
  describe('ELECTION_TYPES', () => {
    it('should contain presidential and midterm types', () => {
      const types = ELECTION_TYPES.map((t) => t.type);
      expect(types).toContain('presidential');
      expect(types).toContain('midterm');
    });

    it('should have exactly 2 election types', () => {
      expect(ELECTION_TYPES).toHaveLength(2);
    });

    it('should have labels for all types', () => {
      for (const electionType of ELECTION_TYPES) {
        expect(electionType.label).toBeDefined();
        expect(electionType.label.length).toBeGreaterThan(0);
      }
    });

    it('should have descriptions for all types', () => {
      for (const electionType of ELECTION_TYPES) {
        expect(electionType.description).toBeDefined();
        expect(electionType.description.length).toBeGreaterThan(0);
      }
    });

    it('should have presidential first', () => {
      expect(ELECTION_TYPES[0].type).toBe('presidential');
    });

    it('should have proper presidential info', () => {
      const presidential = ELECTION_TYPES.find(
        (t) => t.type === 'presidential'
      );
      expect(presidential?.label).toBe('Presidential');
      expect(presidential?.description).toContain('4 years');
    });

    it('should have proper midterm info', () => {
      const midterm = ELECTION_TYPES.find((t) => t.type === 'midterm');
      expect(midterm?.label).toBe('Midterm');
      expect(midterm?.description).toContain('House');
    });
  });

  describe('ElectionType type', () => {
    it('should accept presidential as a valid value', () => {
      const electionType: ElectionType = 'presidential';
      expect(electionType).toBe('presidential');
    });

    it('should accept midterm as a valid value', () => {
      const electionType: ElectionType = 'midterm';
      expect(electionType).toBe('midterm');
    });
  });
});
