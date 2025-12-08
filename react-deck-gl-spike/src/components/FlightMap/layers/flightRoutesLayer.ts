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
  opacity?: number; // 0-1 opacity multiplier for animation mode
}

export function createFlightRoutesLayer({
  data,
  highlightedRouteId,
  onHover,
  onClick,
  opacity = 1,
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
      const opacityMultiplier = opacity;

      if (isHighlighted) {
        return [
          color[0],
          color[1],
          color[2],
          Math.round(255 * opacityMultiplier),
        ];
      }

      // Dim non-highlighted routes when something is highlighted
      if (highlightedRouteId && !isHighlighted) {
        return [
          color[0],
          color[1],
          color[2],
          Math.round(80 * opacityMultiplier),
        ];
      }

      return [
        color[0],
        color[1],
        color[2],
        Math.round(color[3] * opacityMultiplier),
      ];
    },

    getTargetColor: (d) => {
      const isHighlighted = d.id === highlightedRouteId;
      const color = getTargetColor(d.frequency, maxFrequency);
      const opacityMultiplier = opacity;

      if (isHighlighted) {
        return [
          color[0],
          color[1],
          color[2],
          Math.round(255 * opacityMultiplier),
        ];
      }

      if (highlightedRouteId && !isHighlighted) {
        return [
          color[0],
          color[1],
          color[2],
          Math.round(80 * opacityMultiplier),
        ];
      }

      return [
        color[0],
        color[1],
        color[2],
        Math.round(color[3] * opacityMultiplier),
      ];
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
      getSourceColor: [highlightedRouteId, maxFrequency, opacity],
      getTargetColor: [highlightedRouteId, maxFrequency, opacity],
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
