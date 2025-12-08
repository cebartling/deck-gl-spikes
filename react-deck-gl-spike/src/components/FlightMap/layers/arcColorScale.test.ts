import { describe, it, expect } from 'vitest';
import { getSourceColor, getTargetColor } from './arcColorScale';

describe('arcColorScale', () => {
  describe('getSourceColor', () => {
    it('returns cyan-based color by default', () => {
      const color = getSourceColor(100, 200);
      // Cyan: RGB(0, 255, 255)
      expect(color[0]).toBe(0);
      expect(color[1]).toBe(255);
      expect(color[2]).toBe(255);
    });

    it('returns blue-based color in accessible mode', () => {
      const color = getSourceColor(100, 200, true);
      // Blue: RGB(66, 133, 244)
      expect(color[0]).toBe(66);
      expect(color[1]).toBe(133);
      expect(color[2]).toBe(244);
    });

    it('increases opacity with higher frequency', () => {
      const lowFreqColor = getSourceColor(50, 200);
      const highFreqColor = getSourceColor(150, 200);

      expect(highFreqColor[3]).toBeGreaterThan(lowFreqColor[3]);
    });

    it('returns minimum opacity for zero frequency', () => {
      const color = getSourceColor(0, 200);
      expect(color[3]).toBe(100);
    });

    it('returns maximum opacity for max frequency', () => {
      const color = getSourceColor(200, 200);
      expect(color[3]).toBe(255);
    });

    it('handles zero max frequency', () => {
      const color = getSourceColor(0, 0);
      expect(color[3]).toBe(100);
    });
  });

  describe('getTargetColor', () => {
    it('returns magenta-based color by default', () => {
      const color = getTargetColor(100, 200);
      // Magenta: RGB(255, 0, 128)
      expect(color[0]).toBe(255);
      expect(color[1]).toBe(0);
      expect(color[2]).toBe(128);
    });

    it('returns orange-based color in accessible mode', () => {
      const color = getTargetColor(100, 200, true);
      // Orange: RGB(255, 152, 0)
      expect(color[0]).toBe(255);
      expect(color[1]).toBe(152);
      expect(color[2]).toBe(0);
    });

    it('increases opacity with higher frequency', () => {
      const lowFreqColor = getTargetColor(50, 200);
      const highFreqColor = getTargetColor(150, 200);

      expect(highFreqColor[3]).toBeGreaterThan(lowFreqColor[3]);
    });

    it('returns minimum opacity for zero frequency', () => {
      const color = getTargetColor(0, 200);
      expect(color[3]).toBe(100);
    });

    it('returns maximum opacity for max frequency', () => {
      const color = getTargetColor(200, 200);
      expect(color[3]).toBe(255);
    });
  });

  describe('color contrast', () => {
    it('source and target colors are different', () => {
      const sourceColor = getSourceColor(100, 200);
      const targetColor = getTargetColor(100, 200);

      expect(sourceColor[0]).not.toBe(targetColor[0]);
      expect(sourceColor[1]).not.toBe(targetColor[1]);
      expect(sourceColor[2]).not.toBe(targetColor[2]);
    });

    it('accessible source and target colors are different', () => {
      const sourceColor = getSourceColor(100, 200, true);
      const targetColor = getTargetColor(100, 200, true);

      expect(sourceColor[0]).not.toBe(targetColor[0]);
      expect(sourceColor[1]).not.toBe(targetColor[1]);
      expect(sourceColor[2]).not.toBe(targetColor[2]);
    });
  });
});
