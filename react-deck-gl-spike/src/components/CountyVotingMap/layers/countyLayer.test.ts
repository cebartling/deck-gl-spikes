import { describe, it, expect, vi } from 'vitest';
import { GeoJsonLayer } from '@deck.gl/layers';
import { createCountyLayer } from './countyLayer';
import { getVotingColor } from './votingColorScale';
import type {
  CountyFeature,
  CountyFeatureCollection,
} from '../../../types/county';

describe('countyLayer', () => {
  const mockCountyFeature: CountyFeature = {
    type: 'Feature',
    properties: {
      fips: '06001',
      name: 'Alameda',
      state: 'CA',
      stateFips: '06',
      totalVotes: 500000,
      democratVotes: 350000,
      republicanVotes: 130000,
      otherVotes: 20000,
      margin: 220000,
      marginPercent: 44,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-122.0, 37.5],
          [-122.5, 37.5],
          [-122.5, 38.0],
          [-122.0, 38.0],
          [-122.0, 37.5],
        ],
      ],
    },
  };

  const mockCountyFeature2: CountyFeature = {
    type: 'Feature',
    properties: {
      fips: '48201',
      name: 'Harris',
      state: 'TX',
      stateFips: '48',
      totalVotes: 1500000,
      democratVotes: 700000,
      republicanVotes: 780000,
      otherVotes: 20000,
      margin: -80000,
      marginPercent: -5.3,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-95.0, 29.5],
          [-95.5, 29.5],
          [-95.5, 30.0],
          [-95.0, 30.0],
          [-95.0, 29.5],
        ],
      ],
    },
  };

  const mockData: CountyFeatureCollection = {
    type: 'FeatureCollection',
    features: [mockCountyFeature, mockCountyFeature2],
  };

  describe('createCountyLayer', () => {
    it('returns a GeoJsonLayer', () => {
      const layer = createCountyLayer({ data: mockData });
      expect(layer).toBeInstanceOf(GeoJsonLayer);
    });

    it('sets the correct layer id', () => {
      const layer = createCountyLayer({ data: mockData });
      expect(layer.id).toBe('county-voting-layer');
    });

    it('configures layer as pickable', () => {
      const layer = createCountyLayer({ data: mockData });
      expect(layer.props.pickable).toBe(true);
    });

    it('configures layer as stroked', () => {
      const layer = createCountyLayer({ data: mockData });
      expect(layer.props.stroked).toBe(true);
    });

    it('configures layer as filled', () => {
      const layer = createCountyLayer({ data: mockData });
      expect(layer.props.filled).toBe(true);
    });

    it('configures layer as not extruded', () => {
      const layer = createCountyLayer({ data: mockData });
      expect(layer.props.extruded).toBe(false);
    });

    it('passes data to the layer', () => {
      const layer = createCountyLayer({ data: mockData });
      expect(layer.props.data).toEqual(mockData);
    });

    it('handles empty feature collection', () => {
      const emptyData: CountyFeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };
      const layer = createCountyLayer({ data: emptyData });
      expect(layer).toBeInstanceOf(GeoJsonLayer);
      expect(layer.props.data).toEqual(emptyData);
    });

    it('sets lineWidthUnits to pixels', () => {
      const layer = createCountyLayer({ data: mockData });
      expect(layer.props.lineWidthUnits).toBe('pixels');
    });

    it('sets lineWidthMinPixels to 0.5', () => {
      const layer = createCountyLayer({ data: mockData });
      expect(layer.props.lineWidthMinPixels).toBe(0.5);
    });

    it('sets lineWidthMaxPixels to 4', () => {
      const layer = createCountyLayer({ data: mockData });
      expect(layer.props.lineWidthMaxPixels).toBe(4);
    });

    it('disables autoHighlight', () => {
      const layer = createCountyLayer({ data: mockData });
      expect(layer.props.autoHighlight).toBe(false);
    });
  });

  describe('getFillColor', () => {
    it('returns voting color based on margin percent', () => {
      const layer = createCountyLayer({ data: mockData });
      const getFillColor = layer.props.getFillColor as (
        d: CountyFeature
      ) => [number, number, number, number];

      const color = getFillColor(mockCountyFeature);
      const expectedColor = getVotingColor(
        mockCountyFeature.properties.marginPercent
      );

      expect(color).toEqual(expectedColor);
    });

    it('brightens color for highlighted county', () => {
      const layer = createCountyLayer({
        data: mockData,
        highlightedFips: '06001',
      });
      const getFillColor = layer.props.getFillColor as (
        d: CountyFeature
      ) => [number, number, number, number];

      const color = getFillColor(mockCountyFeature);
      const baseColor = getVotingColor(
        mockCountyFeature.properties.marginPercent
      );

      // Should be brighter (higher values, capped at 255)
      expect(color[0]).toBe(Math.min(255, baseColor[0] + 40));
      expect(color[1]).toBe(Math.min(255, baseColor[1] + 40));
      expect(color[2]).toBe(Math.min(255, baseColor[2] + 40));
      expect(color[3]).toBe(255);
    });

    it('dims non-highlighted counties when something is hovered', () => {
      const layer = createCountyLayer({
        data: mockData,
        highlightedFips: '06001', // Different from mockCountyFeature2
      });
      const getFillColor = layer.props.getFillColor as (
        d: CountyFeature
      ) => [number, number, number, number];

      const color = getFillColor(mockCountyFeature2);
      const baseColor = getVotingColor(
        mockCountyFeature2.properties.marginPercent
      );

      // Same RGB but dimmed alpha
      expect(color[0]).toBe(baseColor[0]);
      expect(color[1]).toBe(baseColor[1]);
      expect(color[2]).toBe(baseColor[2]);
      expect(color[3]).toBe(150);
    });
  });

  describe('getLineColor', () => {
    it('returns white for highlighted county', () => {
      const layer = createCountyLayer({
        data: mockData,
        highlightedFips: '06001',
      });
      const getLineColor = layer.props.getLineColor as (
        d: CountyFeature
      ) => [number, number, number, number];

      const color = getLineColor(mockCountyFeature);
      expect(color).toEqual([255, 255, 255, 255]);
    });

    it('returns gray for non-highlighted county', () => {
      const layer = createCountyLayer({ data: mockData });
      const getLineColor = layer.props.getLineColor as (
        d: CountyFeature
      ) => [number, number, number, number];

      const color = getLineColor(mockCountyFeature);
      expect(color).toEqual([80, 80, 80, 150]);
    });
  });

  describe('getLineWidth', () => {
    it('returns 2 for highlighted county', () => {
      const layer = createCountyLayer({
        data: mockData,
        highlightedFips: '06001',
      });
      const getLineWidth = layer.props.getLineWidth as (d: CountyFeature) => number;

      const width = getLineWidth(mockCountyFeature);
      expect(width).toBe(2);
    });

    it('returns 0.5 for non-highlighted county', () => {
      const layer = createCountyLayer({ data: mockData });
      const getLineWidth = layer.props.getLineWidth as (d: CountyFeature) => number;

      const width = getLineWidth(mockCountyFeature);
      expect(width).toBe(0.5);
    });
  });

  describe('interaction handlers', () => {
    it('sets onHover handler when provided', () => {
      const onHover = vi.fn();
      const layer = createCountyLayer({ data: mockData, onHover });
      expect(layer.props.onHover).toBe(onHover);
    });

    it('sets onClick handler when provided', () => {
      const onClick = vi.fn();
      const layer = createCountyLayer({ data: mockData, onClick });
      expect(layer.props.onClick).toBe(onClick);
    });
  });

  describe('updateTriggers', () => {
    it('includes highlightedFips in updateTriggers', () => {
      const layer = createCountyLayer({
        data: mockData,
        highlightedFips: '06001',
      });
      const updateTriggers = layer.props.updateTriggers;

      expect(updateTriggers).toBeDefined();
      expect(updateTriggers.getFillColor).toContain('06001');
      expect(updateTriggers.getLineColor).toContain('06001');
      expect(updateTriggers.getLineWidth).toContain('06001');
    });

    it('updateTriggers change when highlightedFips changes', () => {
      const layer1 = createCountyLayer({
        data: mockData,
        highlightedFips: '06001',
      });
      const layer2 = createCountyLayer({
        data: mockData,
        highlightedFips: '48201',
      });

      expect(layer1.props.updateTriggers.getFillColor).not.toEqual(
        layer2.props.updateTriggers.getFillColor
      );
    });
  });

  describe('layer ID stability', () => {
    it('maintains consistent layer ID for deck.gl diffing', () => {
      const layer1 = createCountyLayer({ data: mockData });
      const layer2 = createCountyLayer({ data: mockData });

      expect(layer1.id).toBe('county-voting-layer');
      expect(layer2.id).toBe('county-voting-layer');
      expect(layer1.id).toBe(layer2.id);
    });
  });
});
