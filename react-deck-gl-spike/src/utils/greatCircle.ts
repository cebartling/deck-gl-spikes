/**
 * Great circle interpolation utilities for flight animation
 */

/**
 * Convert degrees to radians
 */
export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculate intermediate point on a great circle path
 * @param lat1 - Start latitude in degrees
 * @param lon1 - Start longitude in degrees
 * @param lat2 - End latitude in degrees
 * @param lon2 - End longitude in degrees
 * @param fraction - Progress along path (0-1)
 * @returns [longitude, latitude] in degrees
 */
export function interpolateGreatCircle(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  fraction: number
): [number, number] {
  const φ1 = toRadians(lat1);
  const λ1 = toRadians(lon1);
  const φ2 = toRadians(lat2);
  const λ2 = toRadians(lon2);

  // Calculate angular distance
  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin((φ2 - φ1) / 2), 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.pow(Math.sin((λ2 - λ1) / 2), 2)
      )
    );

  if (d === 0) return [lon1, lat1];

  const a = Math.sin((1 - fraction) * d) / Math.sin(d);
  const b = Math.sin(fraction * d) / Math.sin(d);

  const x = a * Math.cos(φ1) * Math.cos(λ1) + b * Math.cos(φ2) * Math.cos(λ2);
  const y = a * Math.cos(φ1) * Math.sin(λ1) + b * Math.cos(φ2) * Math.sin(λ2);
  const z = a * Math.sin(φ1) + b * Math.sin(φ2);

  const φ = Math.atan2(z, Math.sqrt(x * x + y * y));
  const λ = Math.atan2(y, x);

  return [toDegrees(λ), toDegrees(φ)];
}

/**
 * Calculate bearing from point 1 to point 2
 * @returns Bearing in degrees (0-360)
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δλ = toRadians(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  return (toDegrees(θ) + 360) % 360;
}

/**
 * Estimate flight altitude based on progress (simplified cruise profile)
 * @param progress - Flight progress (0-1)
 * @param cruiseAltitude - Maximum cruise altitude in feet
 * @returns Altitude in feet
 */
export function estimateAltitude(
  progress: number,
  cruiseAltitude: number = 35000
): number {
  // Simple climb/cruise/descent profile
  if (progress < 0.15) {
    // Climb phase (0-15%)
    return (progress / 0.15) * cruiseAltitude;
  } else if (progress > 0.85) {
    // Descent phase (85-100%)
    return ((1 - progress) / 0.15) * cruiseAltitude;
  }
  // Cruise phase
  return cruiseAltitude;
}
