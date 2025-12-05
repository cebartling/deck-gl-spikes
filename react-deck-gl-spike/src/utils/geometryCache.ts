import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

/**
 * Shared cache for county geometry data.
 * This is used across multiple hooks to avoid fetching the same geometry data multiple times.
 * The geometry doesn't change between election years, so it's safe to cache indefinitely.
 */
let geometryCache: FeatureCollection<
  Polygon | MultiPolygon,
  { name: string }
> | null = null;

/**
 * Get the cached geometry data.
 */
export function getGeometryCache(): FeatureCollection<
  Polygon | MultiPolygon,
  { name: string }
> | null {
  return geometryCache;
}

/**
 * Set the cached geometry data.
 */
export function setGeometryCache(
  geometry: FeatureCollection<Polygon | MultiPolygon, { name: string }>
): void {
  geometryCache = geometry;
}

/**
 * Clear the cached geometry data (mainly for testing).
 */
export function clearGeometryCache(): void {
  geometryCache = null;
}
