import { describe, it, expect } from 'vitest';
import { frequencyToWidth, passengerVolumeToWidth } from './arcWidthScale';

describe('arcWidthScale', () => {
  describe('frequencyToWidth', () => {
    const MIN_WIDTH = 1;
    const MAX_WIDTH = 8;

    it('returns minimum width for zero frequency', () => {
      const width = frequencyToWidth(0, 200);
      expect(width).toBe(MIN_WIDTH);
    });

    it('returns a value close to max width for max frequency', () => {
      const width = frequencyToWidth(200, 200);
      expect(width).toBeCloseTo(MAX_WIDTH, 1);
    });

    it('returns minimum width when maxFrequency is zero', () => {
      const width = frequencyToWidth(100, 0);
      expect(width).toBe(MIN_WIDTH);
    });

    it('width increases with frequency', () => {
      const lowFreqWidth = frequencyToWidth(50, 200);
      const highFreqWidth = frequencyToWidth(150, 200);
      expect(highFreqWidth).toBeGreaterThan(lowFreqWidth);
    });

    it('uses logarithmic scaling', () => {
      // With logarithmic scaling, the difference between 0-50 and 50-100
      // should be similar (not linear)
      const width50 = frequencyToWidth(50, 200);
      const width100 = frequencyToWidth(100, 200);
      const width150 = frequencyToWidth(150, 200);

      const diff1 = width100 - width50;
      const diff2 = width150 - width100;

      // Log scale should make higher frequency differences smaller
      expect(diff2).toBeLessThan(diff1);
    });

    it('returns values within expected range', () => {
      for (let freq = 0; freq <= 200; freq += 20) {
        const width = frequencyToWidth(freq, 200);
        expect(width).toBeGreaterThanOrEqual(MIN_WIDTH);
        expect(width).toBeLessThanOrEqual(MAX_WIDTH);
      }
    });
  });

  describe('passengerVolumeToWidth', () => {
    const MIN_WIDTH = 1;
    const MAX_WIDTH = 8;

    it('returns minimum width for zero volume', () => {
      const width = passengerVolumeToWidth(0, 5000000);
      expect(width).toBe(MIN_WIDTH);
    });

    it('returns max width for max volume', () => {
      const width = passengerVolumeToWidth(5000000, 5000000);
      expect(width).toBe(MAX_WIDTH);
    });

    it('returns minimum width when maxVolume is zero', () => {
      const width = passengerVolumeToWidth(100000, 0);
      expect(width).toBe(MIN_WIDTH);
    });

    it('width increases with volume', () => {
      const lowVolWidth = passengerVolumeToWidth(1000000, 5000000);
      const highVolWidth = passengerVolumeToWidth(4000000, 5000000);
      expect(highVolWidth).toBeGreaterThan(lowVolWidth);
    });

    it('uses square root scaling', () => {
      // With sqrt scaling, half the volume should give ~0.707 of the range
      const halfVolumeWidth = passengerVolumeToWidth(2500000, 5000000);
      const expectedMidpoint =
        MIN_WIDTH + (MAX_WIDTH - MIN_WIDTH) * Math.SQRT1_2;
      expect(halfVolumeWidth).toBeCloseTo(expectedMidpoint, 1);
    });

    it('returns values within expected range', () => {
      for (let vol = 0; vol <= 5000000; vol += 500000) {
        const width = passengerVolumeToWidth(vol, 5000000);
        expect(width).toBeGreaterThanOrEqual(MIN_WIDTH);
        expect(width).toBeLessThanOrEqual(MAX_WIDTH);
      }
    });
  });
});
