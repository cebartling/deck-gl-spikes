import { describe, it, expect } from 'vitest';
import {
  toRadians,
  toDegrees,
  interpolateGreatCircle,
  calculateBearing,
  estimateAltitude,
} from './greatCircle';

describe('greatCircle', () => {
  describe('toRadians', () => {
    it('converts 0 degrees to 0 radians', () => {
      expect(toRadians(0)).toBe(0);
    });

    it('converts 90 degrees to PI/2 radians', () => {
      expect(toRadians(90)).toBeCloseTo(Math.PI / 2, 10);
    });

    it('converts 180 degrees to PI radians', () => {
      expect(toRadians(180)).toBeCloseTo(Math.PI, 10);
    });

    it('converts 360 degrees to 2*PI radians', () => {
      expect(toRadians(360)).toBeCloseTo(2 * Math.PI, 10);
    });

    it('converts negative degrees', () => {
      expect(toRadians(-90)).toBeCloseTo(-Math.PI / 2, 10);
    });
  });

  describe('toDegrees', () => {
    it('converts 0 radians to 0 degrees', () => {
      expect(toDegrees(0)).toBe(0);
    });

    it('converts PI/2 radians to 90 degrees', () => {
      expect(toDegrees(Math.PI / 2)).toBeCloseTo(90, 10);
    });

    it('converts PI radians to 180 degrees', () => {
      expect(toDegrees(Math.PI)).toBeCloseTo(180, 10);
    });

    it('converts 2*PI radians to 360 degrees', () => {
      expect(toDegrees(2 * Math.PI)).toBeCloseTo(360, 10);
    });

    it('is inverse of toRadians', () => {
      const degrees = 45;
      expect(toDegrees(toRadians(degrees))).toBeCloseTo(degrees, 10);
    });
  });

  describe('interpolateGreatCircle', () => {
    // LAX to JFK coordinates
    const LAX = { lat: 33.9425, lon: -118.4085 };
    const JFK = { lat: 40.6413, lon: -73.7781 };

    it('returns start point at fraction 0', () => {
      const [lon, lat] = interpolateGreatCircle(
        LAX.lat,
        LAX.lon,
        JFK.lat,
        JFK.lon,
        0
      );
      expect(lon).toBeCloseTo(LAX.lon, 4);
      expect(lat).toBeCloseTo(LAX.lat, 4);
    });

    it('returns end point at fraction 1', () => {
      const [lon, lat] = interpolateGreatCircle(
        LAX.lat,
        LAX.lon,
        JFK.lat,
        JFK.lon,
        1
      );
      expect(lon).toBeCloseTo(JFK.lon, 4);
      expect(lat).toBeCloseTo(JFK.lat, 4);
    });

    it('returns midpoint at fraction 0.5', () => {
      const [lon, lat] = interpolateGreatCircle(
        LAX.lat,
        LAX.lon,
        JFK.lat,
        JFK.lon,
        0.5
      );
      // Midpoint should be a valid coordinate between the extremes
      expect(lon).toBeGreaterThan(-130);
      expect(lon).toBeLessThan(-70);
      expect(lat).toBeGreaterThan(30);
      expect(lat).toBeLessThan(50);
      // Should not be at either endpoint
      expect(lon).not.toBeCloseTo(LAX.lon, 1);
      expect(lon).not.toBeCloseTo(JFK.lon, 1);
    });

    it('handles same point (zero distance)', () => {
      const [lon, lat] = interpolateGreatCircle(
        LAX.lat,
        LAX.lon,
        LAX.lat,
        LAX.lon,
        0.5
      );
      expect(lon).toBeCloseTo(LAX.lon, 4);
      expect(lat).toBeCloseTo(LAX.lat, 4);
    });

    it('handles equator crossing', () => {
      // Miami to Buenos Aires
      const [lon, lat] = interpolateGreatCircle(25.8, -80.3, -34.6, -58.4, 0.5);
      // Midpoint should be roughly in the middle
      expect(lon).toBeGreaterThan(-80.3);
      expect(lon).toBeLessThan(-58.4);
      // Latitude should be between the two points (crossing equator)
      expect(lat).toBeLessThan(25.8);
      expect(lat).toBeGreaterThan(-34.6);
    });
  });

  describe('calculateBearing', () => {
    it('calculates bearing going east', () => {
      const bearing = calculateBearing(0, 0, 0, 10);
      expect(bearing).toBeCloseTo(90, 0);
    });

    it('calculates bearing going west', () => {
      const bearing = calculateBearing(0, 0, 0, -10);
      expect(bearing).toBeCloseTo(270, 0);
    });

    it('calculates bearing going north', () => {
      const bearing = calculateBearing(0, 0, 10, 0);
      expect(bearing).toBeCloseTo(0, 0);
    });

    it('calculates bearing going south', () => {
      const bearing = calculateBearing(0, 0, -10, 0);
      expect(bearing).toBeCloseTo(180, 0);
    });

    it('calculates bearing for LAX to JFK (northeast)', () => {
      const bearing = calculateBearing(33.9425, -118.4085, 40.6413, -73.7781);
      // LAX to JFK is roughly northeast
      expect(bearing).toBeGreaterThan(50);
      expect(bearing).toBeLessThan(80);
    });

    it('returns value between 0 and 360', () => {
      const bearing = calculateBearing(40, -74, 34, -118);
      expect(bearing).toBeGreaterThanOrEqual(0);
      expect(bearing).toBeLessThan(360);
    });
  });

  describe('estimateAltitude', () => {
    it('returns 0 at progress 0 (start)', () => {
      expect(estimateAltitude(0)).toBe(0);
    });

    it('returns 0 at progress 1 (end)', () => {
      expect(estimateAltitude(1)).toBe(0);
    });

    it('returns cruise altitude at 50% progress', () => {
      expect(estimateAltitude(0.5)).toBe(35000);
    });

    it('returns cruise altitude at 20% progress (in cruise phase)', () => {
      expect(estimateAltitude(0.2)).toBe(35000);
    });

    it('returns cruise altitude at 80% progress (in cruise phase)', () => {
      expect(estimateAltitude(0.8)).toBe(35000);
    });

    it('returns partial altitude during climb (10%)', () => {
      const altitude = estimateAltitude(0.1);
      expect(altitude).toBeCloseTo((0.1 / 0.15) * 35000, 0);
    });

    it('returns partial altitude during descent (90%)', () => {
      const altitude = estimateAltitude(0.9);
      expect(altitude).toBeCloseTo((0.1 / 0.15) * 35000, 0);
    });

    it('uses custom cruise altitude', () => {
      expect(estimateAltitude(0.5, 40000)).toBe(40000);
    });

    it('scales climb with custom cruise altitude', () => {
      const altitude = estimateAltitude(0.075, 40000);
      expect(altitude).toBeCloseTo(20000, 0);
    });
  });
});
