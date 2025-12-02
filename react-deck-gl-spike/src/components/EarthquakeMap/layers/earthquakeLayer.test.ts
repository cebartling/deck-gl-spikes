import { describe, it, expect } from 'vitest';
import { ScatterplotLayer } from '@deck.gl/layers';
import { createEarthquakeLayer, getDepthColor } from './earthquakeLayer';
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

    it('sets radiusMinPixels to 2', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      expect(layer.props.radiusMinPixels).toBe(2);
    });

    it('sets radiusMaxPixels to 100', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      expect(layer.props.radiusMaxPixels).toBe(100);
    });

    it('getPosition accessor returns [longitude, latitude]', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      const getPosition = layer.props.getPosition as unknown as (d: Earthquake) => number[];
      expect(getPosition(mockEarthquakes[0])).toEqual([-122.5, 37.5]);
      expect(getPosition(mockEarthquakes[1])).toEqual([139.7, 35.7]);
    });

    it('getRadius accessor scales with magnitude', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      const getRadius = layer.props.getRadius as (d: Earthquake) => number;

      const radius1 = getRadius(mockEarthquakes[0]); // magnitude 4.5
      const radius2 = getRadius(mockEarthquakes[1]); // magnitude 6.0

      // Higher magnitude should have larger radius
      expect(radius2).toBeGreaterThan(radius1);

      // Verify the formula: Math.pow(2, magnitude) * 1000
      expect(radius1).toBeCloseTo(Math.pow(2, 4.5) * 1000);
      expect(radius2).toBeCloseTo(Math.pow(2, 6.0) * 1000);
    });

    it('passes data to the layer', () => {
      const layer = createEarthquakeLayer(mockEarthquakes);
      expect(layer.props.data).toBe(mockEarthquakes);
    });

    it('handles empty data array', () => {
      const layer = createEarthquakeLayer([]);
      expect(layer).toBeInstanceOf(ScatterplotLayer);
      expect(layer.props.data).toEqual([]);
    });
  });

  describe('getDepthColor', () => {
    it('returns valid RGBA array', () => {
      const color = getDepthColor(100);
      expect(color).toHaveLength(4);
      expect(color.every((c) => c >= 0 && c <= 255)).toBe(true);
    });

    it('returns yellow color for shallow depth (0km)', () => {
      const color = getDepthColor(0);
      expect(color).toEqual([255, 255, 0, 180]);
    });

    it('returns red color for deep depth (700km+)', () => {
      const color = getDepthColor(700);
      expect(color).toEqual([255, 0, 0, 180]);
    });

    it('returns intermediate color for medium depth', () => {
      const color = getDepthColor(350); // halfway
      expect(color[0]).toBe(255); // red stays at 255
      expect(color[1]).toBeCloseTo(128, 0); // green reduces
      expect(color[2]).toBe(0); // blue stays at 0
      expect(color[3]).toBe(180); // alpha constant
    });

    it('clamps depth at 700km maximum', () => {
      const colorAt700 = getDepthColor(700);
      const colorAt1000 = getDepthColor(1000);
      expect(colorAt1000).toEqual(colorAt700);
    });
  });
});
