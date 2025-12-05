import { describe, it, expect } from 'vitest';
import {
  depthToColor,
  depthToColorMultiStop,
  MAX_DEPTH,
  COLOR_STOPS,
} from './depthColorScale';

describe('depthColorScale', () => {
  describe('depthToColor', () => {
    it('returns yellow for depth 0', () => {
      const color = depthToColor(0);
      expect(color).toEqual([255, 255, 0, 180]);
    });

    it('returns red for depth 700', () => {
      const color = depthToColor(700);
      expect(color).toEqual([255, 0, 0, 180]);
    });

    it('returns intermediate color for depth 350', () => {
      const color = depthToColor(350);
      expect(color[0]).toBe(255); // Red stays at 255
      expect(color[1]).toBeCloseTo(128, 0); // Green reduces
      expect(color[2]).toBe(0); // Blue stays at 0
      expect(color[3]).toBe(180); // Alpha constant
    });

    it('clamps values above MAX_DEPTH', () => {
      const colorAt700 = depthToColor(700);
      const colorAt1000 = depthToColor(1000);
      expect(colorAt1000).toEqual(colorAt700);
    });

    it('returns valid RGBA array with values 0-255', () => {
      const testDepths = [0, 50, 100, 350, 500, 700, 1000];
      testDepths.forEach((depth) => {
        const color = depthToColor(depth);
        expect(color).toHaveLength(4);
        expect(color.every((c) => c >= 0 && c <= 255)).toBe(true);
      });
    });
  });

  describe('depthToColorMultiStop', () => {
    it('returns yellow for depth 0', () => {
      const color = depthToColorMultiStop(0);
      expect(color).toEqual([255, 255, 0, 180]);
    });

    it('returns dark red for depth 700', () => {
      const color = depthToColorMultiStop(700);
      expect(color).toEqual([139, 0, 0, 180]);
    });

    it('interpolates between color stops correctly', () => {
      // At depth 35 (halfway between 0 and 70)
      const color = depthToColorMultiStop(35);
      // Should be between yellow [255, 255, 0] and gold [255, 200, 0]
      expect(color[0]).toBe(255); // Red stays at 255
      expect(color[1]).toBeCloseTo(228, 0); // Green between 255 and 200
      expect(color[2]).toBe(0); // Blue stays at 0
      expect(color[3]).toBe(180);
    });

    it('handles boundary values at each stop', () => {
      COLOR_STOPS.forEach((stop) => {
        const color = depthToColorMultiStop(stop.depth);
        expect(color[0]).toBe(stop.color[0]);
        expect(color[1]).toBe(stop.color[1]);
        expect(color[2]).toBe(stop.color[2]);
        expect(color[3]).toBe(180);
      });
    });

    it('handles values beyond max depth', () => {
      const colorAtMax = depthToColorMultiStop(MAX_DEPTH);
      const colorBeyond = depthToColorMultiStop(1000);
      expect(colorBeyond).toEqual(colorAtMax);
    });

    it('handles negative depth values', () => {
      const color = depthToColorMultiStop(-50);
      expect(color).toEqual([255, 255, 0, 180]); // Returns first stop color
    });

    it('returns valid RGBA array with values 0-255', () => {
      const testDepths = [
        0, 35, 70, 110, 150, 225, 300, 400, 500, 600, 700, 1000,
      ];
      testDepths.forEach((depth) => {
        const color = depthToColorMultiStop(depth);
        expect(color).toHaveLength(4);
        expect(color.every((c) => c >= 0 && c <= 255)).toBe(true);
      });
    });

    it('produces smooth gradient between adjacent stops', () => {
      // Test that colors change smoothly between stops
      const stop1 = depthToColorMultiStop(70);
      const midpoint = depthToColorMultiStop(110);
      const stop2 = depthToColorMultiStop(150);

      // Midpoint green value should be between the two stops
      expect(midpoint[1]).toBeGreaterThan(stop2[1]);
      expect(midpoint[1]).toBeLessThan(stop1[1]);
    });
  });

  describe('constants', () => {
    it('MAX_DEPTH is 700', () => {
      expect(MAX_DEPTH).toBe(700);
    });

    it('COLOR_STOPS has 6 entries', () => {
      expect(COLOR_STOPS).toHaveLength(6);
    });

    it('COLOR_STOPS are in ascending depth order', () => {
      for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
        expect(COLOR_STOPS[i].depth).toBeLessThan(COLOR_STOPS[i + 1].depth);
      }
    });
  });
});
