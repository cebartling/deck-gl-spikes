import { ScatterplotLayer } from '@deck.gl/layers';
import { COORDINATE_SYSTEM } from '@deck.gl/core';
import type { Earthquake } from '../../../types/earthquake';
import { filterValidEarthquakes } from '../../../utils/validateCoordinates';

export function getDepthColor(depth: number): [number, number, number, number] {
  // Yellow (shallow) to Red (deep)
  const t = Math.min(depth / 700, 1); // Normalize to 0-700km range
  return [255, Math.round(255 * (1 - t)), 0, 180];
}

export function createEarthquakeLayer(data: Earthquake[]) {
  // Filter out invalid coordinates before rendering
  const validData = filterValidEarthquakes(data);

  return new ScatterplotLayer<Earthquake>({
    id: 'earthquake-layer',
    data: validData,
    // Use Web Mercator projection (default for lng/lat coordinates)
    coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    pickable: true,
    opacity: 0.6,
    stroked: true,
    filled: true,
    radiusScale: 1,
    radiusMinPixels: 2,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
    getPosition: (d) => [d.longitude, d.latitude],
    getRadius: (d) => Math.pow(2, d.magnitude) * 1000,
    getFillColor: (d) => getDepthColor(d.depth),
    getLineColor: [0, 0, 0, 50],
    updateTriggers: {
      getRadius: data.length,
      getFillColor: data.length,
    },
  });
}
