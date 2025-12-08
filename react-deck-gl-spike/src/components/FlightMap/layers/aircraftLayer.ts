import { IconLayer } from '@deck.gl/layers';
import type { FlightPosition } from '../../../types/flightSchedule';

// Aircraft icon as SVG data URL (simple airplane shape pointing up)
const AIRCRAFT_SVG = `
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 2L20 14L30 16L20 18L16 30L12 18L2 16L12 14Z" fill="#ffffff" stroke="#000000" stroke-width="0.5"/>
</svg>
`;

const AIRCRAFT_ICON = `data:image/svg+xml;base64,${btoa(AIRCRAFT_SVG.trim())}`;

// Icon mapping for deck.gl
const ICON_MAPPING = {
  aircraft: { x: 0, y: 0, width: 32, height: 32, anchorY: 16, mask: false },
};

interface AircraftLayerOptions {
  data: FlightPosition[];
  onHover?: (info: { object?: FlightPosition; x: number; y: number }) => void;
}

export function createAircraftLayer({ data, onHover }: AircraftLayerOptions) {
  return new IconLayer<FlightPosition>({
    id: 'aircraft-layer',
    data,
    pickable: true,

    // Icon configuration
    iconAtlas: AIRCRAFT_ICON,
    iconMapping: ICON_MAPPING,
    getIcon: () => 'aircraft',

    // Position and size
    getPosition: (d) => [d.longitude, d.latitude, d.altitude / 500], // Z elevation for 3D effect
    getSize: 24,
    sizeScale: 1,
    sizeMinPixels: 12,
    sizeMaxPixels: 48,

    // Rotation (bearing) - rotate to match flight direction
    getAngle: (d) => 360 - d.bearing + 90, // Adjust for SVG orientation

    // Color based on altitude (yellow at low, white at cruise)
    getColor: (d) => {
      const altitudeRatio = Math.min(d.altitude / 35000, 1);
      return [
        255,
        Math.round(255 - altitudeRatio * 55), // Slightly yellow at low altitude
        Math.round(200 + altitudeRatio * 55),
        240,
      ];
    },

    // Interaction
    onHover,

    // Billboard mode - icons always face camera
    billboard: true,

    // Smooth transitions for position updates
    transitions: {
      getPosition: {
        duration: 100,
        easing: (t: number) => t,
      },
    },
  });
}
