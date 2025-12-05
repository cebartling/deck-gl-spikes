import type { Earthquake } from '../types/earthquake';

/**
 * Validates that longitude and latitude are within valid ranges.
 * Longitude: -180 to 180
 * Latitude: -90 to 90
 */
export function isValidCoordinate(lng: number, lat: number): boolean {
  return (
    typeof lng === 'number' &&
    typeof lat === 'number' &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90 &&
    !Number.isNaN(lng) &&
    !Number.isNaN(lat)
  );
}

/**
 * Filters out earthquakes with invalid coordinates.
 */
export function filterValidEarthquakes(
  earthquakes: Earthquake[]
): Earthquake[] {
  return earthquakes.filter((eq) =>
    isValidCoordinate(eq.longitude, eq.latitude)
  );
}

/**
 * Normalizes longitude values to the [-180, 180] range.
 * Handles antimeridian crossing cases.
 */
export function normalizeCoordinates(earthquakes: Earthquake[]): Earthquake[] {
  return earthquakes.map((eq) => ({
    ...eq,
    longitude: ((eq.longitude + 540) % 360) - 180,
  }));
}

/**
 * Creates a pre-computed Float32Array buffer for positions.
 * Useful for large datasets to improve performance.
 */
export function createPositionBuffer(earthquakes: Earthquake[]): Float32Array {
  const positions = new Float32Array(earthquakes.length * 2);

  earthquakes.forEach((eq, i) => {
    positions[i * 2] = eq.longitude;
    positions[i * 2 + 1] = eq.latitude;
  });

  return positions;
}
