import { describe, it, expect } from 'vitest';
import {
  getVotingColor,
  getAccessibleVotingColor,
  DEMOCRAT_COLOR,
  REPUBLICAN_COLOR,
  NEUTRAL_COLOR,
} from './votingColorScale';

describe('votingColorScale', () => {
  describe('getVotingColor', () => {
    it('returns blue for full Democrat margin (+100)', () => {
      const color = getVotingColor(100);
      expect(color[0]).toBe(DEMOCRAT_COLOR[0]);
      expect(color[1]).toBe(DEMOCRAT_COLOR[1]);
      expect(color[2]).toBe(DEMOCRAT_COLOR[2]);
      expect(color[3]).toBe(200); // default opacity
    });

    it('returns red for full Republican margin (-100)', () => {
      const color = getVotingColor(-100);
      expect(color[0]).toBe(REPUBLICAN_COLOR[0]);
      expect(color[1]).toBe(REPUBLICAN_COLOR[1]);
      expect(color[2]).toBe(REPUBLICAN_COLOR[2]);
    });

    it('returns neutral color for zero margin', () => {
      const color = getVotingColor(0);
      expect(color[0]).toBe(NEUTRAL_COLOR[0]);
      expect(color[1]).toBe(NEUTRAL_COLOR[1]);
      expect(color[2]).toBe(NEUTRAL_COLOR[2]);
    });

    it('returns blue-tinted color for positive margin', () => {
      const color = getVotingColor(50);
      // Should be between neutral and Democrat blue
      // R channel decreases from neutral (247) toward Democrat (33)
      expect(color[0]).toBeLessThan(NEUTRAL_COLOR[0]);
      expect(color[0]).toBeGreaterThan(DEMOCRAT_COLOR[0]);
    });

    it('returns red-tinted color for negative margin', () => {
      const color = getVotingColor(-50);
      // Should be between Republican red and neutral
      // R channel is between Republican (178) and neutral (247)
      expect(color[0]).toBeLessThan(NEUTRAL_COLOR[0]);
      expect(color[0]).toBeGreaterThan(REPUBLICAN_COLOR[0]);
    });

    it('clamps values above 100 to Democrat blue', () => {
      const color = getVotingColor(150);
      const expected = getVotingColor(100);
      expect(color).toEqual(expected);
    });

    it('clamps values below -100 to Republican red', () => {
      const color = getVotingColor(-150);
      const expected = getVotingColor(-100);
      expect(color).toEqual(expected);
    });

    it('uses custom opacity when provided', () => {
      const color = getVotingColor(0, 255);
      expect(color[3]).toBe(255);
    });

    it('returns valid RGBA values (0-255 range)', () => {
      const testValues = [-100, -50, -25, 0, 25, 50, 100];
      for (const margin of testValues) {
        const color = getVotingColor(margin);
        expect(color[0]).toBeGreaterThanOrEqual(0);
        expect(color[0]).toBeLessThanOrEqual(255);
        expect(color[1]).toBeGreaterThanOrEqual(0);
        expect(color[1]).toBeLessThanOrEqual(255);
        expect(color[2]).toBeGreaterThanOrEqual(0);
        expect(color[2]).toBeLessThanOrEqual(255);
        expect(color[3]).toBeGreaterThanOrEqual(0);
        expect(color[3]).toBeLessThanOrEqual(255);
      }
    });
  });

  describe('getAccessibleVotingColor', () => {
    it('returns purple for full Democrat margin (+100)', () => {
      const color = getAccessibleVotingColor(100);
      expect(color[0]).toBe(94); // Purple R
      expect(color[1]).toBe(60); // Purple G
      expect(color[2]).toBe(153); // Purple B
    });

    it('returns orange for full Republican margin (-100)', () => {
      const color = getAccessibleVotingColor(-100);
      expect(color[0]).toBe(230); // Orange R
      expect(color[1]).toBe(97); // Orange G
      expect(color[2]).toBe(1); // Orange B
    });

    it('returns intermediate color for zero margin', () => {
      const color = getAccessibleVotingColor(0);
      // Should be midpoint between orange and purple
      expect(color[0]).toBe(162); // (230 + 94) / 2 rounded
      expect(color[1]).toBe(79); // (97 + 60) / 2 rounded
      expect(color[2]).toBe(77); // (1 + 153) / 2 rounded
    });

    it('uses custom opacity when provided', () => {
      const color = getAccessibleVotingColor(0, 128);
      expect(color[3]).toBe(128);
    });
  });
});
