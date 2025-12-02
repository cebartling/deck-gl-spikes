import type { Earthquake } from '../../../types/earthquake';

/**
 * Convert magnitude to radius using exponential scale.
 * Base formula: radius = baseSize * 2^(magnitude - minMagnitude)
 *
 * Uses a base-2 exponential scale (each unit increase doubles the radius)
 * to visually represent the logarithmic nature of earthquake magnitudes.
 *
 * @param magnitude - Earthquake magnitude (typically 0-10)
 * @returns Radius in meters
 */
export function magnitudeToRadius(magnitude: number): number {
  const baseSize = 1000; // Base size in meters
  const minMagnitude = 2; // Start scaling at magnitude 2
  const exponent = Math.max(0, magnitude - minMagnitude);
  return baseSize * Math.pow(2, exponent);
}

/**
 * Alternative power scale for more gradual size increase.
 * Maps magnitude range to a quadratic scale between min and max radius.
 *
 * @param magnitude - Earthquake magnitude (typically 0-10)
 * @returns Radius in meters
 */
export function magnitudeToRadiusPower(magnitude: number): number {
  const minMag = 2;
  const maxMag = 9;
  const minRadius = 2000;
  const maxRadius = 200000;

  const normalized = (magnitude - minMag) / (maxMag - minMag);
  const clamped = Math.max(0, Math.min(1, normalized));

  return minRadius + Math.pow(clamped, 2) * (maxRadius - minRadius);
}

/**
 * Pre-compute radius values to avoid repeated calculations.
 * Useful for large datasets to improve rendering performance.
 *
 * @param earthquakes - Array of earthquake data
 * @returns Float32Array with pre-computed radius values
 */
export function createRadiusBuffer(earthquakes: Earthquake[]): Float32Array {
  const radii = new Float32Array(earthquakes.length);

  earthquakes.forEach((eq, i) => {
    radii[i] = magnitudeToRadius(eq.magnitude);
  });

  return radii;
}
