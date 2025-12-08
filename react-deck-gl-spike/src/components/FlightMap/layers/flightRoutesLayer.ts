import { ArcLayer } from '@deck.gl/layers';
import { COORDINATE_SYSTEM } from '@deck.gl/core';
import type { FlightRoute } from '../../../types/flight';
import { getSourceColor, getTargetColor } from './arcColorScale';
import { frequencyToWidth } from './arcWidthScale';

interface FlightRoutesLayerOptions {
  data: FlightRoute[];
  highlightedRouteId?: string | null;
  onHover?: (info: { object?: FlightRoute; x: number; y: number }) => void;
  onClick?: (info: { object?: FlightRoute }) => void;
}

export function createFlightRoutesLayer({
  data,
  highlightedRouteId,
  onHover,
  onClick,
}: FlightRoutesLayerOptions) {
  // Calculate max frequency for normalization
  const maxFrequency = Math.max(...data.map((d) => d.frequency), 1);

  return new ArcLayer<FlightRoute>({
    id: 'flight-routes-layer',
    data,
    coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    pickable: true,

    // Arc endpoints
    getSourcePosition: (d) => [d.origin.longitude, d.origin.latitude],
    getTargetPosition: (d) => [d.destination.longitude, d.destination.latitude],

    // Color gradient from source to target
    getSourceColor: (d) => {
      const isHighlighted = d.id === highlightedRouteId;
      const color = getSourceColor(d.frequency, maxFrequency);

      if (isHighlighted) {
        return [color[0], color[1], color[2], 255];
      }

      // Dim non-highlighted routes when something is highlighted
      if (highlightedRouteId && !isHighlighted) {
        return [color[0], color[1], color[2], 80];
      }

      return color;
    },

    getTargetColor: (d) => {
      const isHighlighted = d.id === highlightedRouteId;
      const color = getTargetColor(d.frequency, maxFrequency);

      if (isHighlighted) {
        return [color[0], color[1], color[2], 255];
      }

      if (highlightedRouteId && !isHighlighted) {
        return [color[0], color[1], color[2], 80];
      }

      return color;
    },

    // Width based on frequency
    getWidth: (d) => {
      const isHighlighted = d.id === highlightedRouteId;
      const baseWidth = frequencyToWidth(d.frequency, maxFrequency);
      return isHighlighted ? baseWidth * 2.5 : baseWidth;
    },

    // Great circle paths for accurate geography
    greatCircle: true,

    // Interaction handlers
    onHover,
    onClick,

    // Performance optimizations
    updateTriggers: {
      getSourceColor: [highlightedRouteId, maxFrequency],
      getTargetColor: [highlightedRouteId, maxFrequency],
      getWidth: [highlightedRouteId, maxFrequency],
    },

    // Smooth transitions for filter changes
    transitions: {
      getSourcePosition: 300,
      getTargetPosition: 300,
      getWidth: 300,
    },
  });
}
