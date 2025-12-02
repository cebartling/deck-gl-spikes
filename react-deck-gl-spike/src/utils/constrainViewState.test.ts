import { describe, it, expect } from 'vitest';
import {
  constrainViewState,
  MAP_BOUNDS,
  ZOOM_BOUNDS,
} from './constrainViewState';
import type { MapViewState } from '@deck.gl/core';

describe('constrainViewState', () => {
  const baseViewState: MapViewState = {
    longitude: 0,
    latitude: 20,
    zoom: 2,
    pitch: 0,
    bearing: 0,
  };

  describe('longitude constraints', () => {
    it('preserves valid longitude within bounds', () => {
      const result = constrainViewState({ ...baseViewState, longitude: 45 });
      expect(result.longitude).toBe(45);
    });

    it('constrains longitude below minimum to -180', () => {
      const result = constrainViewState({ ...baseViewState, longitude: -200 });
      expect(result.longitude).toBe(MAP_BOUNDS.minLongitude);
    });

    it('constrains longitude above maximum to 180', () => {
      const result = constrainViewState({ ...baseViewState, longitude: 200 });
      expect(result.longitude).toBe(MAP_BOUNDS.maxLongitude);
    });

    it('allows longitude at exact minimum bound', () => {
      const result = constrainViewState({ ...baseViewState, longitude: -180 });
      expect(result.longitude).toBe(-180);
    });

    it('allows longitude at exact maximum bound', () => {
      const result = constrainViewState({ ...baseViewState, longitude: 180 });
      expect(result.longitude).toBe(180);
    });
  });

  describe('latitude constraints', () => {
    it('preserves valid latitude within bounds', () => {
      const result = constrainViewState({ ...baseViewState, latitude: 45 });
      expect(result.latitude).toBe(45);
    });

    it('constrains latitude below minimum to -85', () => {
      const result = constrainViewState({ ...baseViewState, latitude: -90 });
      expect(result.latitude).toBe(MAP_BOUNDS.minLatitude);
    });

    it('constrains latitude above maximum to 85', () => {
      const result = constrainViewState({ ...baseViewState, latitude: 90 });
      expect(result.latitude).toBe(MAP_BOUNDS.maxLatitude);
    });

    it('allows latitude at exact minimum bound', () => {
      const result = constrainViewState({ ...baseViewState, latitude: -85 });
      expect(result.latitude).toBe(-85);
    });

    it('allows latitude at exact maximum bound', () => {
      const result = constrainViewState({ ...baseViewState, latitude: 85 });
      expect(result.latitude).toBe(85);
    });
  });

  describe('zoom constraints', () => {
    it('preserves valid zoom within bounds', () => {
      const result = constrainViewState({ ...baseViewState, zoom: 10 });
      expect(result.zoom).toBe(10);
    });

    it('constrains zoom below minimum', () => {
      const result = constrainViewState({ ...baseViewState, zoom: 0.1 });
      expect(result.zoom).toBe(ZOOM_BOUNDS.minZoom);
    });

    it('constrains zoom above maximum', () => {
      const result = constrainViewState({ ...baseViewState, zoom: 25 });
      expect(result.zoom).toBe(ZOOM_BOUNDS.maxZoom);
    });

    it('allows zoom at exact minimum bound', () => {
      const result = constrainViewState({
        ...baseViewState,
        zoom: ZOOM_BOUNDS.minZoom,
      });
      expect(result.zoom).toBe(ZOOM_BOUNDS.minZoom);
    });

    it('allows zoom at exact maximum bound', () => {
      const result = constrainViewState({
        ...baseViewState,
        zoom: ZOOM_BOUNDS.maxZoom,
      });
      expect(result.zoom).toBe(ZOOM_BOUNDS.maxZoom);
    });
  });

  describe('preserves other properties', () => {
    it('preserves pitch when constraining other values', () => {
      const result = constrainViewState({
        ...baseViewState,
        pitch: 45,
        longitude: 200,
      });
      expect(result.pitch).toBe(45);
    });

    it('preserves bearing when constraining other values', () => {
      const result = constrainViewState({
        ...baseViewState,
        bearing: 90,
        latitude: 100,
      });
      expect(result.bearing).toBe(90);
    });
  });

  describe('multiple constraints', () => {
    it('constrains multiple values simultaneously', () => {
      const result = constrainViewState({
        longitude: -200,
        latitude: 100,
        zoom: 0.1,
        pitch: 30,
        bearing: 45,
      });

      expect(result.longitude).toBe(MAP_BOUNDS.minLongitude);
      expect(result.latitude).toBe(MAP_BOUNDS.maxLatitude);
      expect(result.zoom).toBe(ZOOM_BOUNDS.minZoom);
      expect(result.pitch).toBe(30);
      expect(result.bearing).toBe(45);
    });
  });

  describe('returns unchanged valid state', () => {
    it('returns identical values for fully valid view state', () => {
      const validState: MapViewState = {
        longitude: -122.4,
        latitude: 37.8,
        zoom: 12,
        pitch: 0,
        bearing: 0,
      };

      const result = constrainViewState(validState);

      expect(result.longitude).toBe(-122.4);
      expect(result.latitude).toBe(37.8);
      expect(result.zoom).toBe(12);
      expect(result.pitch).toBe(0);
      expect(result.bearing).toBe(0);
    });
  });
});

describe('MAP_BOUNDS constants', () => {
  it('has minLongitude of -180', () => {
    expect(MAP_BOUNDS.minLongitude).toBe(-180);
  });

  it('has maxLongitude of 180', () => {
    expect(MAP_BOUNDS.maxLongitude).toBe(180);
  });

  it('has minLatitude of -85 (Web Mercator limit)', () => {
    expect(MAP_BOUNDS.minLatitude).toBe(-85);
  });

  it('has maxLatitude of 85 (Web Mercator limit)', () => {
    expect(MAP_BOUNDS.maxLatitude).toBe(85);
  });
});

describe('ZOOM_BOUNDS constants', () => {
  it('has minZoom of 0.5', () => {
    expect(ZOOM_BOUNDS.minZoom).toBe(0.5);
  });

  it('has maxZoom of 20', () => {
    expect(ZOOM_BOUNDS.maxZoom).toBe(20);
  });
});
