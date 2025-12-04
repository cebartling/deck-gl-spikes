import { GeoJsonLayer } from '@deck.gl/layers';
import type {
  CountyFeature,
  CountyFeatureCollection,
  CountyVoting,
} from '../../../types/county';
import { getVotingColor } from './votingColorScale';

interface CountyLayerOptions {
  data: CountyFeatureCollection;
  highlightedFips?: string | null;
  onHover?: (info: {
    object?: CountyFeature;
    x: number;
    y: number;
  }) => void;
  onClick?: (info: { object?: CountyFeature }) => void;
}

export function createCountyLayer({
  data,
  highlightedFips,
  onHover,
  onClick,
}: CountyLayerOptions) {
  // GeoJsonLayer<T> where T is the properties type - accessor functions receive Feature<Geometry, T>
  return new GeoJsonLayer<CountyVoting>({
    id: 'county-voting-layer',
    data,
    pickable: true,
    stroked: true,
    filled: true,
    extruded: false,

    // Fill color based on vote margin
    getFillColor: (feature) => {
      const isHighlighted = feature.properties.fips === highlightedFips;

      if (isHighlighted) {
        // Brighten the highlighted county
        const baseColor = getVotingColor(feature.properties.marginPercent);
        return [
          Math.min(255, baseColor[0] + 40),
          Math.min(255, baseColor[1] + 40),
          Math.min(255, baseColor[2] + 40),
          255,
        ] as [number, number, number, number];
      }

      // Dim non-highlighted counties when something is hovered
      if (highlightedFips) {
        const baseColor = getVotingColor(feature.properties.marginPercent);
        return [baseColor[0], baseColor[1], baseColor[2], 150] as [
          number,
          number,
          number,
          number,
        ];
      }

      return getVotingColor(feature.properties.marginPercent);
    },

    // Subtle gray borders, highlighted when selected
    getLineColor: (feature) => {
      const isHighlighted = feature.properties.fips === highlightedFips;
      return isHighlighted
        ? ([255, 255, 255, 255] as [number, number, number, number])
        : ([80, 80, 80, 150] as [number, number, number, number]);
    },

    getLineWidth: (feature) => {
      const isHighlighted = feature.properties.fips === highlightedFips;
      return isHighlighted ? 2 : 0.5;
    },

    lineWidthUnits: 'pixels',
    lineWidthMinPixels: 0.5,
    lineWidthMaxPixels: 4,

    // Interaction handlers
    onHover,
    onClick,
    autoHighlight: false, // We handle highlighting manually

    // Re-render on highlight change
    updateTriggers: {
      getFillColor: [highlightedFips],
      getLineColor: [highlightedFips],
      getLineWidth: [highlightedFips],
    },

    // Enable transitions for smooth updates
    transitions: {
      getFillColor: 200,
      getLineColor: 200,
      getLineWidth: 200,
    },
  });
}
