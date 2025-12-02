import { describe, it, expect } from 'vitest';
import { ScatterplotLayer } from '@deck.gl/layers';
import { COORDINATE_SYSTEM } from '@deck.gl/core';
import { createEarthquakeLayer } from './earthquakeLayer';
import { magnitudeToRadius } from './magnitudeScale';
import { depthToColorMultiStop } from './depthColorScale';
import type { Earthquake } from '../../../types/earthquake';

describe('earthquakeLayer', () => {
  const mockEarthquakes: Earthquake[] = [
    {
      id: '1',
      longitude: -122.5,
      latitude: 37.5,
      depth: 10,
      magnitude: 4.5,
      timestamp: '2024-01-01T00:00:00Z',
      location: 'San Francisco, CA',
    },
    {
      id: '2',
      longitude: 139.7,
      latitude: 35.7,
      depth: 350,
      magnitude: 6.0,
      timestamp: '2024-01-02T00:00:00Z',
      location: 'Tokyo, Japan',
    },
  ];

  describe('createEarthquakeLayer', () => {
    it('returns a ScatterplotLayer', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      expect(layer).toBeInstanceOf(ScatterplotLayer);
    });

    it('sets the correct layer id', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      expect(layer.id).toBe('earthquake-layer');
    });

    it('configures layer as pickable', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      expect(layer.props.pickable).toBe(true);
    });

    it('configures layer opacity to 0.6', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      expect(layer.props.opacity).toBe(0.6);
    });

    it('configures layer as stroked', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      expect(layer.props.stroked).toBe(true);
    });

    it('configures layer as filled', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      expect(layer.props.filled).toBe(true);
    });

    it('sets radiusMinPixels to 3 for touch target visibility', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      expect(layer.props.radiusMinPixels).toBe(3);
    });

    it('sets radiusMaxPixels to 50 to prevent visual clutter', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      expect(layer.props.radiusMaxPixels).toBe(50);
    });

    it('sets radiusUnits to meters', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      expect(layer.props.radiusUnits).toBe('meters');
    });

    it('getPosition accessor returns [longitude, latitude]', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      const getPosition = layer.props.getPosition as unknown as (d: Earthquake) => number[];
      expect(getPosition(mockEarthquakes[0])).toEqual([-122.5, 37.5]);
      expect(getPosition(mockEarthquakes[1])).toEqual([139.7, 35.7]);
    });

    it('getRadius accessor uses magnitudeToRadius scale', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      const getRadius = layer.props.getRadius as (d: Earthquake) => number;

      const radius1 = getRadius(mockEarthquakes[0]); // magnitude 4.5
      const radius2 = getRadius(mockEarthquakes[1]); // magnitude 6.0

      // Higher magnitude should have larger radius
      expect(radius2).toBeGreaterThan(radius1);

      // Verify uses magnitudeToRadius function
      expect(radius1).toBeCloseTo(magnitudeToRadius(4.5));
      expect(radius2).toBeCloseTo(magnitudeToRadius(6.0));
    });

    it('passes filtered data to the layer', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      expect(layer.props.data).toEqual(mockEarthquakes);
    });

    it('handles empty data array', () => {
      const layer = createEarthquakeLayer([]);
      expect(layer).toBeInstanceOf(ScatterplotLayer);
      expect(layer.props.data).toEqual([]);
    });

    it('uses LNGLAT coordinate system', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      expect(layer.props.coordinateSystem).toBe(COORDINATE_SYSTEM.LNGLAT);
    });

    it('filters out earthquakes with invalid coordinates', () => {
      const earthquakesWithInvalid: Earthquake[] = [
        ...mockEarthquakes,
        {
          id: '3',
          longitude: 181, // Invalid
          latitude: 37.5,
          depth: 10,
          magnitude: 4.5,
          timestamp: '2024-01-03T00:00:00Z',
          location: 'Invalid Location',
        },
        {
          id: '4',
          longitude: -122.5,
          latitude: 91, // Invalid
          depth: 10,
          magnitude: 4.5,
          timestamp: '2024-01-04T00:00:00Z',
          location: 'Invalid Location',
        },
      ];

      const layer = createEarthquakeLayer(earthquakesWithInvalid);
      expect(layer.props.data).toHaveLength(2);
      expect(layer.props.data).toEqual(mockEarthquakes);
    });
  });

  describe('getFillColor', () => {
    it('uses depthToColorMultiStop for fill color', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      const getFillColor = layer.props.getFillColor as (
        d: Earthquake
      ) => [number, number, number, number];

      const color1 = getFillColor(mockEarthquakes[0]); // depth 10
      const color2 = getFillColor(mockEarthquakes[1]); // depth 350

      // Verify uses depthToColorMultiStop function
      expect(color1).toEqual(depthToColorMultiStop(10));
      expect(color2).toEqual(depthToColorMultiStop(350));
    });
  });

  describe('position stability', () => {
    it('uses geographic coordinates for position (LNGLAT)', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      // LNGLAT coordinate system ensures deck.gl handles projection
      // and maintains position stability during navigation
      expect(layer.props.coordinateSystem).toBe(COORDINATE_SYSTEM.LNGLAT);
    });

    it('getPosition returns raw geographic coordinates without transformation', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      const getPosition = layer.props.getPosition as unknown as (
        d: Earthquake
      ) => number[];

      // Position should be [longitude, latitude] - raw geographic coords
      const position = getPosition(mockEarthquakes[0]);
      expect(position[0]).toBe(mockEarthquakes[0].longitude);
      expect(position[1]).toBe(mockEarthquakes[0].latitude);
    });

    it('maintains consistent layer ID for deck.gl diffing', () => {
      // Same ID means deck.gl won't recreate the layer during navigation
      const layer1 = createEarthquakeLayer(mockEarthquakes);
      const layer2 = createEarthquakeLayer(mockEarthquakes);

      expect(layer1.id).toBe('earthquake-layer');
      expect(layer2.id).toBe('earthquake-layer');
      expect(layer1.id).toBe(layer2.id);
    });

    it('updateTriggers only depend on data length, not view state', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      const updateTriggers = layer.props.updateTriggers;

      // Update triggers should only contain data-dependent values
      // This ensures layer attributes aren't recalculated on view changes
      expect(updateTriggers).toBeDefined();
      expect(updateTriggers.getRadius).toBe(mockEarthquakes.length);
      expect(updateTriggers.getFillColor).toBe(mockEarthquakes.length);

      // Verify no view-state related triggers
      expect(updateTriggers.zoom).toBeUndefined();
      expect(updateTriggers.longitude).toBeUndefined();
      expect(updateTriggers.latitude).toBeUndefined();
    });

    it('updateTriggers change when data length changes', () => {
      const layer1 = createEarthquakeLayer(mockEarthquakes);
      const layer2 = createEarthquakeLayer([mockEarthquakes[0]]);

      expect(layer1.props.updateTriggers.getRadius).toBe(2);
      expect(layer2.props.updateTriggers.getRadius).toBe(1);
    });
  });
});
